/*
  Glaurung, a UCI chess playing engine.
  Copyright (C) 2004-2008 Tord Romstad

  Glaurung is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  Glaurung is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


////
//// Includes
////

#include <cassert>
#include <cmath>
#include <cstring>

#include "tt.h"


////
//// Functions
////

/// Constructor

TranspositionTable::TranspositionTable(unsigned mbSize) {
  size = 0;
  generation = 0;
  writes = 0;
  entries = 0;
  this->set_size(mbSize);
}


/// Destructor

TranspositionTable::~TranspositionTable() {
  delete [] entries;
}


/// TranspositionTable::set_size sets the size of the transposition table,
/// measured in megabytes.

void TranspositionTable::set_size(unsigned mbSize) {
  unsigned newSize;

  assert(mbSize >= 4 && mbSize <= 1024);

  for(newSize = 1024; newSize * 4 * (sizeof(TTEntry)) <= (mbSize << 20);
      newSize *= 2);
  newSize /= 2;

  if(newSize != size) {
    size = newSize;
    delete [] entries;
    entries = new TTEntry[size * 4];
    if(entries == NULL) {
      std::cerr << "Failed to allocate " << mbSize
                << " MB for transposition table."
                << std::endl;
      exit(EXIT_FAILURE);
    }
    this->clear();
  }
}


/// TranspositionTable::clear overwrites the entire transposition table
/// with zeroes.  It is called whenever the table is resized, or when the
/// user asks the program to clear the table (from the UCI interface).
/// Perhaps we should also clear it when the "ucinewgame" command is recieved?

void TranspositionTable::clear() {
  memset(entries, 0, size * 4 * sizeof(TTEntry));
}


/// TranspositionTable::store writes a new entry containing a position,
/// a value, a value type, a search depth, and a best move to the
/// transposition table.  The transposition table is organized in clusters
/// of four TTEntry objects, and when a new entry is written, it replaces
/// the least valuable of the four entries in a cluster.  A TTEntry t1 is
/// considered to be more valuable than a TTEntry t2 if t1 is from the
/// current search and t2 is from a previous search, or if the depth of t1
/// is bigger than the depth of t2.

void TranspositionTable::store(const Position &pos, Value v, Depth d,
                               Move m, ValueType type) {
  TTEntry *tte, *replace;

  tte = replace = entries + int(pos.get_key() & (size - 1)) * 4;
  for(int i = 0; i < 4; i++) {
    if((tte+i)->key() == pos.get_key()) {
      if(m == MOVE_NONE)
        m = (tte+i)->move();
      *(tte+i) = TTEntry(pos.get_key(), v, type, d, m, generation);
      return;
    }
    if(replace->generation() == generation) {
      if((tte+i)->generation() != generation ||
         (tte+i)->depth() < replace->depth())
        replace = tte+i;
    }
    else if((tte+i)->generation() != generation &&
            (tte+i)->depth() < replace->depth())
      replace = tte+i;
  }
  *replace = TTEntry(pos.get_key(), v, type, d, m, generation);
  writes++;
}


/// TranspositionTable::retrieve looks up the current position in the
/// transposition table, and extracts the value, value type, depth and
/// best move if the position is found.  The return value is true if
/// the position is found, and false if it isn't.

bool TranspositionTable::retrieve(const Position &pos, Value *value,
                                  Depth *d, Move *move,
                                  ValueType *type) const {
  TTEntry *tte;
  bool found = false;

  tte = entries + int(pos.get_key() & (size - 1)) * 4;
  for(int i = 0; i < 4 && !found ; i++)
    if((tte+i)->key() == pos.get_key()) {
      tte = tte + i;
      found = true;
    }
  if(!found) {
    *move = MOVE_NONE;
    return false;
  }

  *value = tte->value();
  *type = tte->type();
  *d = tte->depth();
  *move = tte->move();

  return true;
}


/// TranspositionTable::new_search() is called at the beginning of every new
/// search.  It increments the "generation" variable, which is used to
/// distinguish transposition table entries from previous searches from
/// entries from the current search.

void TranspositionTable::new_search() {
  generation++;
  writes = 0;
}


/// TranspositionTable::insert_pv() is called at the end of a search 
/// iteration, and inserts the PV back into the PV.  This makes sure the
/// old PV moves are searched first, even if the old TT entries have been
/// overwritten.

void TranspositionTable::insert_pv(const Position &pos, Move pv[]) {
  UndoInfo u;
  Position p(pos);

  for(int i = 0; pv[i] != MOVE_NONE; i++) {
    this->store(p, VALUE_NONE, Depth(0), pv[i], VALUE_TYPE_NONE);
    p.do_move(pv[i], u);
  }
}


/// TranspositionTable::full() returns the permill of all transposition table
/// entries which have received at least one write during the current search.
/// It is used to display the "info hashfull ..." information in UCI.

int TranspositionTable::full() {
  double N = double(size) * 4.0;
  return int(1000 * (1 - exp(writes * log(1.0 - 1.0/N))));
}


/// Constructors

TTEntry::TTEntry() {
}

TTEntry::TTEntry(Key k, Value v, ValueType t, Depth d, Move m,
                 int generation) {
  key_ = k;
  data = (m & 0x7FFFF) | (t << 20) | (generation << 23);
  value_ = v;
  depth_ = int16_t(d);
}


/// Functions for extracting data from TTEntry objects.

Key TTEntry::key() const {
  return key_;
}

Depth TTEntry::depth() const {
  return Depth(depth_);
}

Move TTEntry::move() const {
  return Move(data & 0x7FFFF);
}

Value TTEntry::value() const {
  return Value(value_);
}

ValueType TTEntry::type() const {
  return ValueType((data >> 20) & 3);
}

int TTEntry::generation() const {
  return (data >> 23);
}
