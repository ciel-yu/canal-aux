'''
Created on Nov 24, 2010

@author: Ciel
'''
from optparse import OptionParser
from collections import defaultdict, namedtuple
import re
import os


def main():
	parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options]' )

	parser.set_defaults( **{
		'verbose': False,
	} )

	parser.add_option( '-v', '--verbose', action='store_true' )

	opts, args = parser.parse_args()

	maz_ids = {
		'0ex':							[r'\bcomic +0ex\b'],
		'angel_club':					[r'\bangel +club\b', 										r'\bangel倶楽部\b'],
		'aun':							[r'\bcomic +aun\b', 										r'\b阿吽\b'],
		'bangaichi':					[r'\bbangaichi\b', 											r'ばんがいち'],
		'bazooka':						[r'\bbazooka\b', 											r'\bバズーカ\b'],
		'buster':						[r'\bbuster +comic\b'],
		'hana_ryou_gakuen_shotou_club':	[r'\bhana *ryou *gakuen *shotou(?:bu)?(?: *club)?\b', 		r'\b華陵学園 *初等部\b'],
		'hime_dorobou':					[r'\bhime +dorobou\b', 										r'\b姫盗人\b'],
		'hotmilk':						[r'\bhotmilk\b', 											r'\bホットミルク\b'],
		'kairakuten':					[r'\bkairakuten(?! *beast)\b', 								r'\b(快楽天|快樂天)(?! *(?:beast|ビースト))\b'],
		'kairakuten_beast':				[r'\bkairakuten +beast\b', 									r'\b快楽天 *ビースト\b', r'\b快楽天 *beast\b'],
		'lo':							[r'\bcomic +lo\b'],
		'masyo':						[r'\bmasyo\b', 												r'\bマショウ\b'],
		'megaplus':						[r'\bmegaplus\b', 											r'\bメガプラス\b'],
		'megastore':					[r'\bmegastore(?![ -]+h)\b', 								r'メガストア(?![ -]+h)\b'],
		'megastore_h':					[r'\bmegastore[ -]+h\b', 									r'\bメガストア[ -]*h\b'],
		'mens_young':					[r'\bmen\'?s +young(?!.*(?:雷|IKAZUCHI))\b', 				r'\bメンズヤング(?!.*(?:雷|IKAZUCHI))\b'],
		'moemax':						[r'\bmoemax(?! *(?:jr))\b', 								r'\bモエマックス(?! *(?:jr))\b'],
		'momohime':						[r'\bmomohime\b', 											r'\b桃姫\b'],
		'moog':							[r'\bmoog\b', 												r'\bムーグ\b'],
		'muga':							[r'\bmuga\b', 												r'\b夢雅\b'],
		'mujin':						[r'\bmujin\b'],
		'papipo':						[r'\bpapipo\b', 											r'\bパピポ\b'],
		'penguin_club':					[r'\bpenguin +club(?!.*sanzoku *ban)\b', 		 			r'\bペンギンクラブ(?! *山賊版)\b'],
		'penguin_club_sanzoku_ban':		[r'\bpenguin +club +sanzoku +ban\b', 						r'\bペンギンクラブ *山賊版\b'],
		'pot':							[r'\bcomic +pot\b'],
		'potpourri_club':				[r'\bpotpourri +club\b', 									r'\bポプリクラブ\b'],
		'purumelo':						[r'\bpurumelo\b', 											r'\bプルメロ\b'],
		'revolution':					[r'\brevolution\b', 										r'\bレヴォリューション\b'],
		'rin':							[r'\brin\b'],
		'shingeki':						[r'\bshingeki\b', 											r'\b真激\b'],
		'shitsu_rakuten':				[r'\bshitsu +rakuten\b', 									r'\b失楽天\b'],
		'shoujo_tengoku':				[r'\bshoujo +tengoku\b', 									r'\b少女天国\b'],
		'tenma':						[r'\btenma\b', 												r'\b天魔\b'],
		'unreal':						[r'\bunreal\b', 											r'\bアンリアル\b'],
		'xo':							[r'\bcomic +xo\b'],

		'sigma':						[r'\bcomic +sigma(?! *(?:plus|\+))\b', 						r'\bシグマ(?! *プラス)\b'],
		'sigma_plus':					[r'\bcomic +sigma *(?:plus|\+)\b', 							r'\bシグマ *プラス\b'],
		'orekano':						[r'\borekano\b', 											r'\bオレカノ\b'],
		'papipo':						[r'\bpapipo\b', 											r'\bパピポ\b'],
		'pizazz':						[r'\bcomic +pizazz\b' ],
		'plum':							[r'\bplum\b'],
		'hit_man':						[r'\bhit +man\b', 											r'\bビタマン\b'],
		'jun_ai_kajitsu':				[r'\bJun-*ai *Kajitsu\b', 									r'\b純愛果実\b'],
		'candoll':						[r'\bキャンドール\b'],
		'maga_gold':					[r'\bメガGOLD\b'],
		'doki':							[r'\bDoki!?\b(?! *Special)' ],
		'doki_Special':					[r'\bDoki!? *Special\b' ],
		'young':						[r'\byoung *comic\b'],
		'ino':							[r'\bcomic +ino\b' ],
		'mate':							[r'\bcomic +mate\b' ],
		'namaiki':						[r'\bNamaiki\b', 											r'\bナマイキッ\b'],

		'megamilk':						[r'\bmegamilk\b', 											r'\bメガミルク\b'],

		'ペンギンセレブ':					[r'\bペンギンセレブ\b']
	}

	r_map = {}

	for d in ( dict( ( re.compile( i, re.I | re.U ), key.lower() ) for i in maz_ids[key] ) for key in maz_ids ): r_map.update( d )

	ps = {
		'y':[ r'\b(?P<y>(?:19|20)\d{2})(?:-\d{2})', r'(?P<y>(?:19|20)\d{2})年\d{1,2}月' ],
		'm':[ r'(?:19|20)\d{2}-(?P<m>\d{1,2})', r'年(?P<m>\d{1,2})月号?' ],
		'v':[ r'(?:vol\.|#)\s*(?P<v>\d{1,3})\b' ]
	}

	ps = dict( ( x, [ re.compile( p, re.I | re.U ) for p in ps[x] ] ) for x in ps )

	def __( text ):
		for x in ps:
			for p in ps[x]:
				m = p.search( text )
				if m:
					yield x, m.group( x )
					break
			else:
				yield x, None
		for k in r_map:
			if k.search( text ):
				yield 'id', r_map[k]
				break
		else:
			yield 'id', None

	pattern_tag = re.compile( r'\[@\w+ \d{4}-\d{2}#', re.U )


	for file in ( x for x in os.listdir( '.' ) if not pattern_tag.search( x ) and ( True or os.path.isfile( x ) ) ):
		info = dict( __( file ) )

		if info['id'] and ( info['y'] or info['m'] or info['v'] ) :
			os.renames( file, "[@{} {:04d}-{:02d}#{:03d}]{}".format( info['id'], int( info['y'] or 0 ), int( info['m'] or 0 ), int( info['v'] or 0 ) , file ) )



if __name__ == '__main__':
	main()
