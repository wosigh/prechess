set DEBUG=NO
call pu.cmd
call package-it.cmd
call pdk-install com.vocshopgames.chess_0.1.2_all.ipk
plink -P 10022 root@localhost -pw "viktor" "chmod 755 /media/cryptofs/apps/usr/palm/applications/com.vocshopgames.chess/*"
