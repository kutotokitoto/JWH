'use client';

import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './Decompose.module.css';
import React from 'react';

// 초성, 중성, 종성 배열
const CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNGSUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONGSUNG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 로마자 변환 매핑
const CHOSUNG_TO_ROMAN: { [key: string]: string } = {
  'ㄱ': 'G', 'ㄲ': 'GG', 'ㄴ': 'N', 'ㄷ': 'D', 'ㄸ': 'DD', 'ㄹ': 'R', 
  'ㅁ': 'M', 'ㅂ': 'B', 'ㅃ': 'BB', 'ㅅ': 'S', 'ㅆ': 'SS', 'ㅇ': 'W', 
  'ㅈ': 'J', 'ㅉ': 'JJ', 'ㅊ': 'C', 'ㅋ': 'K', 'ㅌ': 'T', 'ㅍ': 'P', 'ㅎ': 'H'
};

const JUNGSUNG_TO_ROMAN: { [key: string]: string } = {
  'ㅏ': 'A', 'ㅐ': 'AE', 'ㅑ': 'YA', 'ㅒ': 'YAE', 'ㅓ': 'EO', 'ㅔ': 'E',
  'ㅕ': 'YEO', 'ㅖ': 'YE', 'ㅗ': 'O', 'ㅘ': 'OA', 'ㅙ': 'OAE', 'ㅚ': 'OI',
  'ㅛ': 'YO', 'ㅜ': 'U', 'ㅝ': 'UEO', 'ㅞ': 'UE', 'ㅟ': 'UI', 'ㅠ': 'YU',
  'ㅡ': 'EU', 'ㅢ': 'EUI', 'ㅣ': 'I'
};

const JONGSUNG_TO_ROMAN: { [key: string]: string } = {
  'ㄱ': 'G', 'ㄲ': 'GG', 'ㄳ': 'GS', 'ㄴ': 'N', 'ㄵ': 'NJ', 'ㄶ': 'NH',
  'ㄷ': 'D', 'ㄹ': 'R', 'ㄺ': 'RG', 'ㄻ': 'RM', 'ㄼ': 'RB', 'ㄽ': 'RS',
  'ㄾ': 'RT', 'ㄿ': 'RP', 'ㅀ': 'RH', 'ㅁ': 'M', 'ㅂ': 'B', 'ㅄ': 'BS',
  'ㅅ': 'S', 'ㅆ': 'SS', 'ㅇ': 'W', 'ㅈ': 'J', 'ㅊ': 'C', 'ㅋ': 'K',
  'ㅌ': 'T', 'ㅍ': 'P', 'ㅎ': 'H'
};

interface HangulChar {
  char: string;          // 실제 한글 문자
  roman: string;         // 로마자 변환 (예: GAG)
  groupId: string;       // 그룹 ID (예: 01-01-01)
  components: string[];  // 컴포넌트 ID 배열 (예: ['G-01-01', '01-A-01', '01-01-G'])
}

interface DragItem {
  char: string;
  type: 'chosung' | 'jungsung' | 'jongsung';
  groupId: number;
}

interface DraggableButtonProps {
  char: string;
  type: 'chosung' | 'jungsung' | 'jongsung';
  groupId: number;
}

const DraggableButton = React.forwardRef<HTMLButtonElement, DraggableButtonProps>(
  ({ char, type, groupId }, ref) => {
    const [{ isDragging }, drag] = useDrag({
      type,
      item: { char, type, groupId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const dragRef = useCallback(
      (node: HTMLButtonElement | null) => {
        if (node) {
          drag(node);
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }
      },
      [drag, ref]
    );

    return (
      <button
        ref={dragRef}
        className={styles.draggableButton}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {char}
      </button>
    );
  }
);

DraggableButton.displayName = 'DraggableButton';

interface DropTargetProps {
  onDrop: (item: DragItem) => void;
  accepts: ('chosung' | 'jungsung' | 'jongsung')[];
  groupId: number;
  chars: string[];
}

const DropTarget = React.forwardRef<HTMLDivElement, DropTargetProps>(
  ({ onDrop, accepts, groupId, chars }, ref) => {
    const [{ isOver }, drop] = useDrop({
      accept: accepts,
      drop: (item: DragItem) => onDrop({ ...item, groupId }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    const dropRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          drop(node);
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }
      },
      [drop, ref]
    );

    return (
      <div
        ref={dropRef}
        className={`${styles.dropTarget} ${isOver ? styles.isOver : ''}`}
      >
        {chars.map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>
    );
  }
);

DropTarget.displayName = 'DropTarget';

interface CombinationCell {
  id: string;
  chars: string[];
}

const ADOBE_KR_9_CHARS = new Set([
  '가각간갇갈갉갊갋감갑값갓갔강갖갗같갚갛개객갠갣갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜걥거걱건걷걸걺검겁겂것겄겅겆겉겊겋게겍겐겔겜겝겟겠겡겨격겪견겯결겷겸겹겻겼경겿곁계곈곌곕곗곘고곡곤곧골곪곬곯곰곱곳공곶곹과곽관괄괆괌괍괏괐광괒괘괜괠괢괩괬괭괴괵괸괼굄굅굇굉교굔굘굠굡굣굥구국군굳굴굵굶굻굼굽굿궁궂궃궈궉권궐궜궝궤궷궸귀귁귄귈귐귑귓귕규균귤귬귭그극근귿글긁긂긇금급긋긍긏긑긓긔긘긩기긱긴긷길긺김깁깃깄깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깯깰깸깹깻깼깽꺄꺅꺆꺌꺍꺠꺤꺼꺽꺾껀껄껌껍껏껐껑껓껕께껙껜껨껫껭껴껸껼꼇꼈꼉꼍꼐꼬꼭꼰꼲꼳꼴꼼꼽꼿꽁꽂꽃꽅꽈꽉꽌꽐꽜꽝꽤꽥꽨꽸꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿏꿔꿘꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨뀰뀼끄끅끈끊끌끎끓끔끕끗끙끝끠끤끼끽낀낄낌낍낏낐낑나낙낚난낟날낡낢남납낫났낭낮낯낱낳내낵낸낻낼냄냅냇냈냉냐냑냔냗냘냠냡냣냥냬너넉넋넌넏널넑넒넓넘넙넛넜넝넢넣네넥넨넫넬넴넵넷넸넹넾녀녁년녇녈념녑녔녕녘녜녠녱노녹논놀놁놂놈놉놋농놑높놓놔놘놜놥놨놰뇄뇌뇍뇐뇔뇜뇝뇟뇡뇨뇩뇬뇰뇸뇹뇻뇽누눅눈눋눌눍눔눕눗눙눝눠눴눼뉘뉜뉠뉨뉩뉴뉵뉻뉼늄늅늉늑는늗늘늙늚늠늡늣능늦늧늪늫늬늰늴늼늿닁니닉닌닏닐닒님닙닛닝닞닠닢다닥닦단닫달닭닮닯닳담답닷닸당닺닻닽닿대댁댄댈댐댑댓댔댕댖댜댠댱더덕덖던덛덜덞덟덤덥덧덩덫덮덯데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됏됐되된될됨됩됫됬됭됴두둑둔둗둘둚둠둡둣둥둬뒀뒈뒙뒝뒤뒨뒬뒵뒷뒸뒹듀듄듈듐듕드득든듣들듥듦듧듬듭듯등듸듼딀디딕딘딛딜딤딥딧딨딩딪딫딮따딱딲딴딷딸땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떄떈떔떙떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똠똡똣똥똬똭똰똴뙇뙈뙜뙤뙨뚜뚝뚠뚤뚧뚫뚬뚯뚱뚸뛔뛰뛴뛸뜀뜁뜄뜅뜌뜨뜩뜬뜯뜰뜳뜸뜹뜻뜽뜾띃띄띈띌띔띕띠띡띤띨띰띱띳띵라락란랃랄람랍랏랐랑랒랖랗래랙랜랟랠램랩랫랬랭랰랲랴략랸럅럇량럐럔러럭런럲럳럴럼럽럿렀렁렇레렉렌렐렘렙렛렜렝려력련렫렬렴렵렷렸령례롄롑롓로록론롣롤롬롭롯롱롸롹롼뢍뢔뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤈뤘뤠뤤뤼뤽륀륄륌륏륑류륙륜률륨륩륫륭르륵른를름릅릇릉릊릍릎릏릐릔리릭린릴림립릿맀링맆마막만많맏말맑맒맔맘맙맛맜망맞맟맡맢맣매맥맨맫맬맴맵맷맸맹맺맻맽먀먁먄먈먐먕머먹먼멀멂멈멉멋멌멍멎멓메멕멘멛멜멤멥멧멨멩멫며멱면멷멸몃몄명몇몌몐모목몫몬몯몰몱몲몸몹못몽뫄뫈뫘뫙뫠뫴뫼묀묄묌묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭤뭥뭬뮈뮊뮌뮐뮙뮛뮤뮨뮬뮴뮷뮹므믁믄믈믐믑믓믕믜믠믭믱미믹민믿밀밂밈밉밋밌밍및밑바박밖밗반받발밝밞밟밣밤밥밧밨방밫밭배백밲밴밷밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱜뱝뱟뱡버벅번벋벌벎범법벗벘벙벚벝벟베벡벤벧벨벰벱벳벴벵벼벽변별볌볍볏볐병볓볕볘볜보복볶본볻볼볽볾볿봄봅봇봉봐봔봣봤봥봬뵀뵈뵉뵌뵐뵘뵙뵜뵤뵨뵴부북분붇불붉붊붐붑붓붔붕붙붚붜붝붠붤붭붰붴붸뷁뷔뷕뷘뷜뷥뷩뷰뷴뷸븀븁븃븅브븍븐블븕븜븝븟븡븨븩븰븽비빅빈빋빌빎빔빕빗빘빙빚빛빠빡빤빧빨빩빪빰빱빳빴빵빻빼빽빾뺀뺄뺌뺍뺏뺐뺑뺘뺙뺜뺨뻐뻑뻔뻗뻘뻙뻠뻣뻤뻥뻬뻰뼁뼈뼉뼌뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽓뽕뾔뾰뾱뿅뿌뿍뿐뿔뿕뿜뿝뿟뿡쀠쀼쁑쁘쁜쁠쁨쁩쁭삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅샆새색샌샏샐샘샙샛샜생샤샥샨샬샴샵샷샹샾섀섁섄섈섐섕서석섞섟선섣설섦섧섬섭섯섰성섶세섹센섿셀셈셉셋셌셍셑셔셕션셜셤셥셧셨셩셰셱셴셸솀솁솅소속솎손솓솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇴쇵쇼쇽숀숄숌숍숏숑숖수숙순숟술숨숩숫숭숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슌슐슘슛슝스슥슨슫슬슭슲슴습슷승싀싁시식신싣실싥싫심십싯싰싱싶싸싹싻싼싿쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩쌰쌱썅써썩썬썰썲썸썹썼썽쎂쎄쎅쎈쎌쎔쎠쎤쎵쎼쏀쏘쏙쏚쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쏼쐈쐋쐐쐤쐬쐰쐴쐼쐽쑀쑈쑝쑤쑥쑨쑬쑴쑵쑹쒀쒐쒔쒜쒠쒬쒸쒼쓔쓩쓰쓱쓴쓸쓺쓿씀씁씃씌씐씔씜씨씩씫씬씰씹씻씼씽씿아악안앉않앋알앍앎앏앓암압앗았앙앜앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏얐양얕얗얘얜얠얩얬얭어억언얹얺얻얼얽얾엄업없엇었엉엊엌엎엏에엑엔엘엠엡엣엤엥여역엮연열엶엷염엽엾엿였영옅옆옇예옌옏옐옘옙옛옜옝오옥옦온옫올옭옮옯옰옳옴옵옷옹옻와왁완왈왎왐왑왓왔왕왘왜왝왠왬왭왯왰왱외왹왼욀욈욉욋욌욍요욕욘욜욤욥욧용우욱운욷울욹욺움웁웂웃웅웇워웍원월웜웝웟웠웡웨웩웬웰웸웹웻웽위윅윈윌윔윕윗윘윙유육윤율윰윱윳융윷으윽윾은읃을읇읊음읍읎읏응읒읓읔읕읖읗의읜읠읨읩읫읬읭이익인읻일읽읾잃임입잇있잉잊잌잍잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬쟵저적젂전젇절젉젊젋점접젓젔정젖제젝젠젤젬젭젯젱져젹젼졀졂졈졉졋졌졍졔조족존졸졺좀좁좃종좆좋좌좍좐좔좟좡좦좨좬좼좽죄죅죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥭쥰쥴쥼즁즈즉즌즐즒즘즙즛증즤지직진짇질짊짐집짓짔징짖짗짙짚짜짝짠짢짣짤짧짬짭짯짰짱짲째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨤쨩쨰쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩰쩽쪄쪘쪼쪽쫀쫃쫄쫌쫍쫏쫑쫒쫓쫘쫙쫜쫠쫬쫴쬈쬐쬔쬘쬠쬡쬧쬬쬭쬲쭁쭈쭉쭌쭐쭘쭙쭛쭝쭤쭸쭹쮀쮓쮜쮸쯍쯔쯕쯤쯧쯩찌찍찐찓찔찜찝찟찡찢찦찧차착찬찮찰참찹찻찼창찾찿채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳊쳐쳔쳡쳤쳥쳬쳰촁초촉촌촐촘촙촛총촣촤촥촨촬촵촹쵀최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췍췐췔취췬췰췹췻췽츄츅츈츌츔츙츠측츤츨츩츰츱츳층츼치칙친칟칠칡칢침칩칫칬칭카칵칸칻칼캄캅캇캉캐캑캔캘캠캡캣캤캥캨캬캭캰컁컄커컥컨컫컬컴컵컷컸컹컽케켁켄켈켐켑켓켔켕켘켙켜켠켤켬켭켯켰켱켸코콕콘콛콜콤콥콧콩콰콱콴콸쾀쾃쾅쾌쾡쾨쾰쿄쿈쿠쿡쿤쿨쿰쿱쿳쿵쿼쿽퀀퀄퀌퀑퀘퀜퀠퀭퀴퀵퀸퀼큄큅큇큉큐큔큘큠크큭큰큲클큼큽킁킄킈키킥킨킴킵킷킸킹타탁탄탇탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍턔터턱턴털턺턻텀텁텃텄텅테텍텐텔템텝텟텡텦텨텬텰텻텼톄톈토톡톤톧톨톰톱톳통톺톼퇀퇘퇴퇻툇툉툐툥투툭툰툴툶툼툽퉁퉈퉜퉤퉷튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틍틑틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팑팓팔팖팜팝팟팠팡팤팥패팩팬팯팰팸팹팻팼팽퍄퍅퍝퍼퍽펀펄펌펍펏펐펑펖페펙펜펠펨펩펫펭펴펵편펼폄폅폈평폐폔폘폡폣포폭폰폴폼폽폿퐁퐅퐈퐉퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗픙픠픵피픽핀필핌핍핏핐핑하학한할핤핥함합핫항핰핳해핵핸핻핼햄햅햇했행햋햏햐햔햣향햬헀허헉헌헐헒헗험헙헛헝헠헡헣헤헥헨헬헴헵헷헸헹헿혀혁현혈혐협혓혔형혜혠혤혭호혹혼홀홅홈홉홋홍홑화확환활홥홧홨황홰홱홴횃횅회획횐횔횝횟횡효횬횰횻횽후훅훈훌훍훐훑훓훔훕훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흝흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힜힝힣'
]);

export default function Decompose() {
  const [chosungGroups, setChosungGroups] = useState<string[][]>(Array(2).fill([]));
  const [jungsungGroups, setJungsungGroups] = useState<string[][]>(Array(3).fill([]));
  const [jongsungGroups, setJongsungGroups] = useState<string[][]>(Array(4).fill([]));
  const [checkChar, setCheckChar] = useState<string>('');
  const [charInfo, setCharInfo] = useState<HangulChar | null>(null);
  const [combinationMode, setCombinationMode] = useState<'all' | 'adobe'>('all');

  const handleModeChange = (mode: 'all' | 'adobe') => {
    setCombinationMode(mode);
  };

  const handleDrop = (type: 'chosung' | 'jungsung' | 'jongsung') => {
    return (item: DragItem) => {
      if (type === 'chosung') {
        setChosungGroups(prev => {
          const newGroups = [...prev];
          if (!newGroups[item.groupId].includes(item.char)) {
            newGroups[item.groupId] = [...newGroups[item.groupId], item.char];
          }
          return newGroups;
        });
      } else if (type === 'jungsung') {
        setJungsungGroups(prev => {
          const newGroups = [...prev];
          if (!newGroups[item.groupId].includes(item.char)) {
            newGroups[item.groupId] = [...newGroups[item.groupId], item.char];
          }
          return newGroups;
        });
      } else {
        setJongsungGroups(prev => {
          const newGroups = [...prev];
          if (!newGroups[item.groupId].includes(item.char)) {
            newGroups[item.groupId] = [...newGroups[item.groupId], item.char];
          }
          return newGroups;
        });
      }
    };
  };

  const handleGroupNumberClick = (type: 'chosung' | 'jungsung' | 'jongsung') => {
    if (type === 'chosung') {
      setChosungGroups(prev => {
        const newLength = prev.length === 10 ? 1 : prev.length + 1;
        return Array(newLength).fill([]);
      });
    } else if (type === 'jungsung') {
      setJungsungGroups(prev => {
        const newLength = prev.length === 10 ? 1 : prev.length + 1;
        return Array(newLength).fill([]);
      });
    } else if (type === 'jongsung') {
      setJongsungGroups(prev => {
        const newLength = prev.length === 10 ? 1 : prev.length + 1;
        return Array(newLength).fill([]);
      });
    }
  };

  const generateHangulData = (char: string, cho: string, jung: string, jong: string | null, 
    choGroup: number, jungGroup: number, jongGroup: number): HangulChar => {
    const romanCho = CHOSUNG_TO_ROMAN[cho];
    const romanJung = JUNGSUNG_TO_ROMAN[jung];
    const romanJong = jong ? JONGSUNG_TO_ROMAN[jong] : '';
    
    const groupId = `${String(choGroup).padStart(2, '0')}-${String(jungGroup).padStart(2, '0')}-${String(jongGroup).padStart(2, '0')}`;
    
    // 종성이 있을 때만 종성 컴포넌트를 포함
    const components = [
      `${romanCho}-${String(choGroup).padStart(2, '0')}-${String(jongGroup).padStart(2, '0')}`,
      `${String(choGroup).padStart(2, '0')}-${romanJung}-${String(jongGroup).padStart(2, '0')}`,
    ];

    if (jong) {
      components.push(`${String(choGroup).padStart(2, '0')}-${String(jungGroup).padStart(2, '0')}-${romanJong}`);
    }

    return {
      char,
      roman: `${romanCho}${romanJung}${romanJong}`,
      groupId,
      components
    };
  };

  const generateCombinations = () => {
    const result: CombinationCell[] = [];
    const hangulData: HangulChar[] = [];
    
    for (let i = 0; i < chosungGroups.length; i++) {
      for (let j = 0; j < jungsungGroups.length; j++) {
        for (let k = 0; k < jongsungGroups.length; k++) {
          const id = `${String(i + 1).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}-${String(k + 1).padStart(2, '0')}`;
          const chars = [];
          
          for (const cho of chosungGroups[i] || []) {
            for (const jung of jungsungGroups[j] || []) {
              for (const jong of jongsungGroups[k] || []) {
                // Adobe-KR-9 모드일 때는 해당 규격에 맞는 문자만 포함
                const unicode = 0xAC00 + (CHOSUNG.indexOf(cho) * 21 * 28) + (JUNGSUNG.indexOf(jung) * 28) + JONGSUNG.indexOf(jong);
                const char = String.fromCharCode(unicode);
                
                if (combinationMode === 'adobe' && !ADOBE_KR_9_CHARS.has(char)) {
                  continue;
                }
                
                chars.push(char);
                hangulData.push(generateHangulData(char, cho, jung, jong, i + 1, j + 1, k + 1));
              }
              
              if (jongsungGroups[k].length === 0) {
                // Adobe-KR-9 모드일 때는 해당 규격에 맞는 문자만 포함
                const unicode = 0xAC00 + (CHOSUNG.indexOf(cho) * 21 * 28) + (JUNGSUNG.indexOf(jung) * 28);
                const char = String.fromCharCode(unicode);
                
                if (combinationMode === 'adobe' && !ADOBE_KR_9_CHARS.has(char)) {
                  continue;
                }
                
                chars.push(char);
                hangulData.push(generateHangulData(char, cho, jung, null, i + 1, j + 1, k + 1));
              }
            }
          }
          
          if (chars.length > 0) {
            result.push({ id, chars });
          }
        }
      }
    }
    
    return result;
  };

  const handleCharCheck = (input: string) => {
    if (input.length !== 1) return;
    
    // 한글 유니코드 범위 체크
    const code = input.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return;
    
    // 초성, 중성, 종성 분리
    const charCode = code - 0xAC00;
    const cho = CHOSUNG[Math.floor(charCode / (21 * 28))];
    const jung = JUNGSUNG[Math.floor((charCode % (21 * 28)) / 28)];
    const jong = JONGSUNG[charCode % 28];

    // 각 자모음이 어느 그룹에 속하는지 찾기
    const choGroup = chosungGroups.findIndex(group => group.includes(cho)) + 1;
    const jungGroup = jungsungGroups.findIndex(group => group.includes(jung)) + 1;
    const jongGroup = jong ? jongsungGroups.findIndex(group => group.includes(jong)) + 1 : 1;

    if (choGroup && jungGroup && (jong ? jongGroup : true)) {
      const data = generateHangulData(
        input,
        cho,
        jung,
        jong || null,
        choGroup,
        jungGroup,
        jongGroup
      );
      setCharInfo(data);
    } else {
      setCharInfo(null);
    }
  };

  const generateAllComponentNames = () => {
    const componentNames: string[] = [];
    
    // 각 그룹별로 모든 문자에 대한 컴포넌트 이름 생성
    for (let i = 0; i < chosungGroups.length; i++) {
      for (let j = 0; j < jongsungGroups.length; j++) {
        for (const cho of chosungGroups[i] || []) {
          const romanCho = CHOSUNG_TO_ROMAN[cho];
          componentNames.push(`${romanCho}-${String(i + 1).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}`);
        }
      }
    }

    for (let i = 0; i < chosungGroups.length; i++) {
      for (let j = 0; j < jongsungGroups.length; j++) {
        for (const jung of jungsungGroups[i] || []) {
          const romanJung = JUNGSUNG_TO_ROMAN[jung];
          componentNames.push(`${String(i + 1).padStart(2, '0')}-${romanJung}-${String(j + 1).padStart(2, '0')}`);
        }
      }
    }

    for (let i = 0; i < chosungGroups.length; i++) {
      for (let j = 0; j < jongsungGroups.length; j++) {
        for (const jong of jongsungGroups[i] || []) {
          if (jong) {  // 빈 문자열 제외
            const romanJong = JONGSUNG_TO_ROMAN[jong];
            componentNames.push(`${String(i + 1).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}-${romanJong}`);
          }
        }
      }
    }

    return componentNames.sort().join(', ');
  };

  const generateDownloadContent = () => {
    const combinations = generateCombinations();
    const lines: string[] = [];

    for (const combination of combinations) {
      for (const char of combination.chars) {
        // 초성, 중성, 종성 분리
        const code = char.charCodeAt(0) - 0xAC00;
        const cho = CHOSUNG[Math.floor(code / (21 * 28))];
        const jung = JUNGSUNG[Math.floor((code % (21 * 28)) / 28)];
        const jong = JONGSUNG[code % 28];

        // 각 자모음이 어느 그룹에 속하는지 찾기
        const choGroup = chosungGroups.findIndex(group => group.includes(cho)) + 1;
        const jungGroup = jungsungGroups.findIndex(group => group.includes(jung)) + 1;
        const jongGroup = jong ? jongsungGroups.findIndex(group => group.includes(jong)) + 1 : 1;

        // 한글 데이터 생성
        const data = generateHangulData(
          char,
          cho,
          jung,
          jong || null,
          choGroup,
          jungGroup,
          jongGroup
        );

        // 종성이 있는 경우와 없는 경우를 구분하여 컴포넌트 정보 포맷팅
        const componentInfo = data.components.length === 3
          ? `{${data.components.join(', ')}}`
          : `{${data.components.join(', ')}}`;

        // 각 문자에 대한 정보를 한 줄로 포맷팅
        lines.push(`${data.char} ${data.roman}_${data.groupId} ${componentInfo}`);
      }
    }

    // 모든 라인을 정렬하고 줄바꿈으로 연결
    return lines.sort().join('\n');
  };

  const handleDownload = () => {
    const content = generateDownloadContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hangul_components.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <h1 className={styles.title}>한글 묶음 나누기</h1>
        <div className={styles.modeButtons}>
          <button
            className={`${styles.modeButton} ${combinationMode === 'adobe' ? styles.active : ''}`}
            onClick={() => handleModeChange('adobe')}
          >
            2780자
          </button>
          <button
            className={`${styles.modeButton} ${combinationMode === 'all' ? styles.active : ''}`}
            onClick={() => handleModeChange('all')}
          >
            11172자
          </button>
        </div>
        <div className={styles.layout}>
          <div className={styles.rowSection}>
            <div className={styles.leftPanel}>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>초성</h2>
                  <div className={styles.groupCount}>
                    <span>묶음 수</span>
                    <button 
                      className={styles.groupButton}
                      onClick={() => handleGroupNumberClick('chosung')}
                    >
                      {chosungGroups.length}
                    </button>
                  </div>
                </div>
                <div className={styles.buttons}>
                  {CHOSUNG.map((char) => (
                    <DraggableButton 
                      key={char} 
                      char={char} 
                      type="chosung"
                      groupId={0}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.rightPanel}>
              <div className={styles.resultSection}>
                <h3>초성 {chosungGroups.length}묶음</h3>
                <div className={styles.resultGrid} style={{ 
                  gridTemplateColumns: `repeat(${chosungGroups.length}, 1fr)` 
                }}>
                  {chosungGroups.map((group, i) => (
                    <DropTarget
                      key={`chosung-${i}`}
                      accepts={['chosung']}
                      groupId={i}
                      chars={group}
                      onDrop={handleDrop('chosung')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rowSection}>
            <div className={styles.leftPanel}>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>중성</h2>
                  <div className={styles.groupCount}>
                    <span>묶음 수</span>
                    <button 
                      className={styles.groupButton}
                      onClick={() => handleGroupNumberClick('jungsung')}
                    >
                      {jungsungGroups.length}
                    </button>
                  </div>
                </div>
                <div className={styles.buttons}>
                  {JUNGSUNG.map((char) => (
                    <DraggableButton 
                      key={char} 
                      char={char} 
                      type="jungsung"
                      groupId={0}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.rightPanel}>
              <div className={styles.resultSection}>
                <h3>중성 {jungsungGroups.length}묶음</h3>
                <div className={styles.resultGrid} style={{ 
                  gridTemplateColumns: `repeat(${jungsungGroups.length}, 1fr)` 
                }}>
                  {jungsungGroups.map((group, i) => (
                    <DropTarget
                      key={`jungsung-${i}`}
                      accepts={['jungsung']}
                      groupId={i}
                      chars={group}
                      onDrop={handleDrop('jungsung')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rowSection}>
            <div className={styles.leftPanel}>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>종성</h2>
                  <div className={styles.groupCount}>
                    <span>묶음 수</span>
                    <button 
                      className={styles.groupButton}
                      onClick={() => handleGroupNumberClick('jongsung')}
                    >
                      {jongsungGroups.length}
                    </button>
                  </div>
                </div>
                <div className={styles.buttons}>
                  {JONGSUNG.filter(char => char !== '').map((char) => (
                    <DraggableButton 
                      key={char} 
                      char={char} 
                      type="jongsung"
                      groupId={0}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.rightPanel}>
              <div className={styles.resultSection}>
                <h3>종성 {jongsungGroups.length}묶음</h3>
                <div className={styles.resultGrid} style={{ 
                  gridTemplateColumns: `repeat(${jongsungGroups.length}, 1fr)` 
                }}>
                  {jongsungGroups.map((group, i) => (
                    <DropTarget
                      key={`jongsung-${i}`}
                      accepts={['jongsung']}
                      groupId={i}
                      chars={group}
                      onDrop={handleDrop('jongsung')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.componentCheckSection}>
          <h2>컴포넌트 확인</h2>
          <div className={styles.componentCheck}>
            <div className={styles.inputSection}>
              <input
                type="text"
                value={checkChar}
                onChange={(e) => {
                  setCheckChar(e.target.value);
                  handleCharCheck(e.target.value);
                }}
                maxLength={1}
                placeholder="한글"
              />
            </div>
            <div className={styles.infoSection}>
              {charInfo ? (
                <div className={styles.charInfoHeader}>
                  <div>낱글자 이름: {charInfo.roman}</div>
                  <div>낱글자 위치: {charInfo.roman}_{charInfo.groupId}</div>
                  <div className={styles.components}>
                    {charInfo.components.map((comp, i) => (
                      <div key={i}>{comp}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.noInfo}>
                  한글 한 글자를 입력하세요
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.combinationsSection}>
          <h2>가능한 모든 묶음 조합</h2>
          <div className={styles.combinationsGrid} style={{
            gridTemplateColumns: `repeat(${Math.min(4, chosungGroups.length * jungsungGroups.length)}, 1fr)`
          }}>
            {generateCombinations().map(({ id, chars }) => (
              <div key={id} className={styles.combinationCell}>
                <div className={styles.combinationId}>{id}</div>
                <div className={styles.combinationChars}>
                  {chars.length > 0 ? chars.join(', ') : '(없음)'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.allComponentsSection}>
          <h2>모든 컴포넌트 이름</h2>
          <button 
            className={styles.downloadButton}
            onClick={handleDownload}
          >
            텍스트 파일로 저장
          </button>
          <div className={styles.allComponents}>
            {generateAllComponentNames()}
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 