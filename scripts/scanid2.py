# coding:utf-8
from collections import defaultdict
from common.glob import iglob
from functools import partial
import argparse
import itertools
import operator
import os
import re

reiu = partial( re.compile, flags=re.I | re.U )

class m_entry:
	def __init__( self, _id, prio, regex ):
		self.id = _id
		self.prio = prio
		self.regex = list( map( reiu, regex ) )

	def __repr__( self ):
		return "entry {} {} {}".format( self.id, self.prio, self.regex )

maz_ids = sorted( ( m_entry( * x ) for x in [
		( 'shitsu_rakuten', 				10, 		[r'\bshitsu +rakuten\b', 									r'失楽天'] ),
		( 'kairakuten_beast', 				10, 		[r'\bkairakuten +beast\b', 									r'快楽天 *ビースト', r'快楽天 *beast\b'] ),
		( 'megastore_h', 					10, 		[r'\bmegastore[ -]+h\b', 									r'メガストア[ -]*h\b'] ),
		( 'penguin_club_sanzoku_ban', 		10, 		[r'\bpenguin +club +sanzoku +ban\b', 						r'ペンギンクラブ *山賊版'] ),
		( 'sigma_plus', 					10, 		[r'\bcomic +sigma *(?:plus|\+)\b', 							r'シグマ *プラス'] ),
		( 'doki_Special', 					10, 		[r'\bDoki!? *Special\b' ] ),

		( '0ex', 							0, 		[r'\bcomic +0ex\b'] ),
		( 'angel_club', 					0, 		[r'\bangel +club\b', 										r'\bangel倶楽部'] ),
		( 'aun', 							0, 		[r'\bcomic +aun\b', 										r'阿吽'] ),
		( 'bangaichi', 						0, 		[r'\bbangaichi\b', 											r'ばんがいち'] ),
		( 'bazooka', 						0, 		[r'\bbazooka\b', 											r'バズーカ'] ),
		( 'buster', 						0, 		[r'\bbuster +comic\b'] ),
		( 'hana_ryou_gakuen_shotou_club', 	0, 		[r'\bhana *ryou *gakuen *shotou(?:bu)?(?: *club)?\b', 		r'華陵学園 *初等部'] ),
		( 'hime_dorobou', 					0, 		[r'\bhime +dorobou\b', 										r'姫盗人'] ),
		( 'hotmilk', 						0, 		[r'\bhotmilk\b', 											r'ホットミルク'] ),
		( 'kairakuten', 					0, 		[r'\bkairakuten\b', 										r'(快楽天|快樂天)'] ),
		( 'lo', 							0, 		[r'\bcomic +lo\b'] ),
		( 'masyo', 							0, 		[r'\bmasyo\b', 												r'マショウ'] ),
		( 'megaplus', 						0, 		[r'\bmegaplus\b', 											r'メガプラス'] ),
		( 'megastore', 						0, 		[r'\bmegastore\b', 											r'メガストア'] ),
		( 'mens_young', 					0, 		[r'\bmen\'?s +young\b', 									r'メンズヤング'] ),
		( 'moemax', 						0, 		[r'\bmoemax\b', 											r'モエマックス'] ),
		( 'momohime', 						0, 		[r'\bmomohime\b', 											r'桃姫'] ),
		( 'moog', 							0, 		[r'\bmoog\b', 												r'ムーグ'] ),
		( 'muga', 							0, 		[r'\bmuga\b', 												r'夢雅'] ),
		( 'mujin', 							0, 		[r'\bmujin\b'] ),
		( 'papipo', 						0, 		[r'\bpapipo\b', 											r'パピポ'] ),
		( 'penguin_club', 					0, 		[r'\bpenguin +club\b', 		 								r'ペンギンクラブ'] ),
		( 'pot', 							0, 		[r'\bcomic +pot\b'] ),
		( 'potpourri_club', 				0, 		[r'\bpotpourri +club\b', 									r'ポプリクラブ'] ),
		( 'purumelo', 						0, 		[r'\bpurumelo\b', 											r'プルメロ'] ),
		( 'revolution', 					0, 		[r'\brevolution\b', 										r'レヴォリューション'] ),
		( 'rin', 							0, 		[r'\brin\b'] ),
		( 'shingeki', 						0, 		[r'\bshingeki\b', 											r'真激'] ),
		( 'shoujo_tengoku', 				0, 		[r'\bshoujo +tengoku\b', 									r'少女天国'] ),
		( 'tenma', 							0, 		[r'\btenma\b', 												r'天魔'] ),
		( 'unreal', 						0, 		[r'\bunreal\b', 											r'アンリアル'] ),
		( 'xo', 							0, 		[r'\bcomic +xo\b'] ),

		( 'sigma', 							0, 		[r'\bcomic +sigma\b', 										r'シグマ'] ),
		( 'orekano', 						0, 		[r'\borekano\b', 											r'オレカノ'] ),
		( 'papipo', 						0, 		[r'\bpapipo\b', 											r'パピポ'] ),
		( 'pizazz', 						0, 		[r'\bcomic +pizazz\b' ] ),
		( 'plum', 							0, 		[r'\bplum\b'] ),
		( 'hit_man', 						0, 		[r'\bhit +man\b', 											r'ビタマン'] ),
		( 'jun_ai_kajitsu', 				0, 		[r'\bJun-*ai *Kajitsu\b', 									r'純愛果実'] ),
		( 'candoll', 						0, 		[r'\bキャンドール\b'] ),
		( 'maga_gold', 						0, 		[r'\bメガGOLD\b'] ),
		( 'doki', 							0, 		[r'\bDoki!?\b' ] ),
		( 'young', 							0, 		[r'\byoung *comic\b'] ),
		( 'ino', 							0, 		[r'\bcomic +ino\b' ] ),
		( 'mate', 							0, 		[r'\bcomic +mate\b' ] ),
		( 'namaiki', 						0, 		[r'\bNamaiki\b', 											r'ナマイキッ'] ),

		( 'megamilk', 						0, 		[r'\bmegamilk\b', 											r'メガミルク'] ),

		( 'ペンギンセレブ', 				0, 		[r'ペンギンセレブ'] )
	] )
	, key=operator.attrgetter( 'prio' )	, reverse=True
 )

ps = dict( ( k, list( map( reiu, v ) ) ) for k, v in  [
	( 'y', [ r'\b(?P<y>(?:19|20)\d{2})(?:-\d{2})', r'(?P<y>(?:19|20)\d{2})年\d{1,2}月' ] ),
	( 'm', [ r'(?:19|20)\d{2}-(?P<m>\d{1,2})', r'年(?P<m>\d{1,2})月号?' ] ),
	( 'd', [ r'(?:19|20)\d{2}-\d\d?-(?P<d>\d{1,2})'] ),
	( 'v', [ r'(?:vol\.|#)\s*(?P<v>\d{1,3})\b', r'(?P<v>\d{1,3})巻' ] )
] )


def main():
	parser = argparse.ArgumentParser( description="scan id", formatter_class=argparse.ArgumentDefaultsHelpFormatter )

	parser.add_argument( 'filespec', nargs="*", default=["*"] )
	parser.add_argument( '-v', '--verbose', action='store_true' )
	parser.add_argument( '-f', dest='force_update', action='store_true' )


	parser.set_defaults( **{
		'verbose':False,
		'force_update':False
	} )

	opts = parser.parse_args()

	pattern_tag = re.compile( r'\[@\S+ \d{4}-\d{2}#\d{3}\]', re.U )

	for file in  filter( os.path.isfile, itertools.chain.from_iterable( map( iglob, set( opts.filespec ) ) ) ):
		path, name = os.path.split( file )

		if pattern_tag.search( name ) and not opts.force_update:
			continue

		info = dict()

		for key in ps:
			for p in ps[key]:
				m = p.search( name )
				if m:
					info[key] = int( m.group( key ) or 0 )
					break
			else:
				info[key] = 0

		for entry in maz_ids:
			for p in entry.regex:
				if p.search( name ):
					info['id'] = entry.id
					break
			if 'id' in info:
				break
		else:
			info['id'] = None

		if info['id'] and any( info[x] for x in "ymv" ) :
			book_id = "@{} {:04d}-{:02d}#{:03d}".format( info['id'], info['y'], info['m'], info['v'] )
			if opts.force_update:
				name = pattern_tag.sub( '', name )
			name = "[" + book_id + "]" + name

			os.renames( file, os.path.join( path, name ) )


if __name__ == '__main__':
	main()
