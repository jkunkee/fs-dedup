fs-dedup
========

Nodejs module for condensing backup file trees

#### Methodology

Do you have a variety of directories that, at some level, all contain exactly
the same thing?

Have no fear, `fs-dedup` is here!

Given a list of paths, fs-dedup walks them and enumerates the normal files.
Outputs are generated for the following actions:

1. If the name has been seen, check the hashes for it.
    1. If the hashes match, add the full path name to the `duplicates` array.
    2. Otherwise, add the full path name to the `sameName` array.
2. Repeat step `1` for the basename.
2. If it is a new file, index it. (sha1 & md5, file name, basename)


`fs-dedup` output is for the following actions:

* copy only one of duplicate files (filename and hash match) to the destination
* compare and select/skip duplicate file names
* observe hash collisions on large numbers of small files :)

