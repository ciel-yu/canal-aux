# coding: utf-8

import os
import sys



_tbl = dict( ( x, x - 0xff00 + 0x20 ) for x in range( 0xff01, 0xff7f ) )
# 空格
_tbl.update( {0x3000:0x0020, 0x00a0:0x0020} )
# 中点
_tbl.update( {0x30fb:0x00b7, 0xff65:0x00b7} )
# 方括号
_tbl.update( {0x3010:0x005b, 0x3011:0x005d} )
# \u301c
_tbl.update( {0x301c:0x007e} )
# 排除: * / ? \ | < > " :
_tbl.update( {0xff0a:0xff0a, 0xff0f:0xff0f, 0xff1f:0xff1f, 0xff3c:0xff3c, 0xff5c:0xff5c, 0xff1c:0xff1c, 0xff1e:0xff1e, 0xff02:0xff02, 0xff1a:0xff1a} )

curr_dir = '.'
for filename in os.listdir( curr_dir ):
	new_file = filename.translate( _tbl )
	if filename != new_file and not os.path.exists( new_file ):
		try:
			os.renames( filename, new_file )
		except:
			pass
