call package-it.cmd
call pdk-install com.vocshopgames.chess_0.0.5_all.ipk
plink -P 10022 root@localhost -pw "" "chmod 755 /media/cryptofs/apps/usr/palm/applications/com.vocshopgames.chess/*"
