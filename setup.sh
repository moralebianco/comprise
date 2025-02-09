#!/bin/bash

# https://www.sqlite.org/fts5.html#building_a_loadable_extension
if [ ! -f fts5.so ]; then
  wget -c https://www.sqlite.org/src/tarball/SQLite-trunk.tgz?uuid=trunk -O SQLite-trunk.tgz
  tar -xzf SQLite-trunk.tgz
  cd SQLite-trunk || exit
  ./configure
  make fts5.c sqlite3.h sqlite3ext.h
  gcc -O2 -fPIC -shared fts5.c -o ../fts5.so
  cd ../
fi

echo 'SQLite FTS5 Extension is installed'
rm -rf SQLite-trunk*
