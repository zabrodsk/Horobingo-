import { ZodiacSign, AchievementId, Theme } from './types';

export const ZODIAC_SIGNS: { id: ZodiacSign; nameKey: string; emoji: string }[] = [
  { id: ZodiacSign.Universal, nameKey: 'zodiac.universal', emoji: '🌌' },
  { id: ZodiacSign.Aries, nameKey: 'zodiac.beran', emoji: '♈' },
  { id: ZodiacSign.Taurus, nameKey: 'zodiac.byk', emoji: '♉' },
  { id: ZodiacSign.Gemini, nameKey: 'zodiac.blizenci', emoji: '♊' },
  { id: ZodiacSign.Cancer, nameKey: 'zodiac.rak', emoji: '♋' },
  { id: ZodiacSign.Leo, nameKey: 'zodiac.lev', emoji: '♌' },
  { id: ZodiacSign.Virgo, nameKey: 'zodiac.panna', emoji: '♍' },
  { id: ZodiacSign.Libra, nameKey: 'zodiac.vahy', emoji: '♎' },
  { id: ZodiacSign.Scorpio, nameKey: 'zodiac.stir', emoji: '♏' },
  { id: ZodiacSign.Sagittarius, nameKey: 'zodiac.strelec', emoji: '♐' },
  { id: ZodiacSign.Capricorn, nameKey: 'zodiac.kozoroh', emoji: '♑' },
  { id: ZodiacSign.Aquarius, nameKey: 'zodiac.vodnar', emoji: '♒' },
  { id: ZodiacSign.Pisces, nameKey: 'zodiac.ryby', emoji: '♓' },
];

export const THEMES: { id: Theme; nameKey: string; emoji: string }[] = [
  { id: Theme.Universal, nameKey: 'theme.universal', emoji: '🌍' },
  { id: Theme.F1, nameKey: 'theme.f1', emoji: '🏎️' },
  { id: Theme.School, nameKey: 'theme.school', emoji: '🎓' },
];

// Fallback data in case the AI generation fails
const FALLBACK_HOROSCOPE_UNIV: string[] = [
  'V oblasti práce se objeví nečekaná příležitost, která prověří vaše schopnosti.',
  'Ve vztazích dnes zavládne harmonie, využijte ji k upevnění pout.',
  'Dnešek přeje finančním rozhodnutím, ale dvakrát měřte, jednou řežte.',
  'Pocítíte příval kreativní energie, která vám pomůže vyřešit starý problém.',
  'Nečekané setkání s přítelem vám přinese důležitý vhled do vaší situace.',
  'Vaše intuice bude dnes mimořádně silná, naslouchejte jí.',
  'Menší zdravotní neduh může být signálem, že je čas zpomalit a odpočinout si.',
  'Někdo z vašeho okolí ocení vaši radu, neváhejte se podělit o svou moudrost.',
  'Dostanete zprávu, která může mírně zamíchat vašimi plány na víkend.',
  'Je ideální den na to, abyste se naučili něco nového nebo si přečetli knihu.',
  'Pozor na zbytečné konflikty kvůli maličkostem, diplomacie se dnes vyplatí.',
  'Vaše snaha z poslední doby bude konečně oceněna, i když možná nečekanou formou.',
  'Energie dne přeje romantice. Pokud jste nezadaní, mějte oči otevřené.',
  'Naskytne se příležitost k malému dobrodružství, nebraňte se spontánnosti.',
  'Vaše charisma dnes bude na vrcholu, využijte ho při důležitém jednání.',
  'Možná objevíte skrytý talent nebo koníček, který vás nadchne.',
  'Udělejte si čas na své blízké, společně strávené chvíle vám dodají energii.',
  'Finanční bonus nebo malá výhra je na obzoru.',
  'Dnes se vám podaří dokončit něco, co jste dlouho odkládali.',
  'Den přeje cestování a plánování budoucích výletů.',
];

const FALLBACK_HOROSCOPE_F1: string[] = [
  'Vaše kariéra nabere tempo jako vůz na cílové rovince.',
  'V týmové spolupráci bude klíčová precizní komunikace, jako mezi pilotem a boxy.',
  'Finanční strategie bude vyžadovat bleskové rozhodnutí, nepropásněte správný okamžik.',
  'Vyhnete se konfliktu s elegancí, jako když se pilot vyhne kolizi v první zatáčce.',
  'Nečekaná zpráva vás donutí změnit strategii, buďte flexibilní.',
  'Váš výkon v práci bude dnes jako nejrychlejší kolo, všimne si ho i vedení.',
  'Pozor na "opotřebení pneumatik" – vaše energie není nekonečná, plánujte si přestávky.',
  'V lásce se může objevit nečekaný "safety car", který zpomalí dění, ale dá vám čas na rozmyšlenou.',
  'Podaří se vám "předjet" konkurenci díky odvážnému, ale promyšlenému tahu.',
  'Dnes bude důležité udržet si chladnou hlavu, i když situace bude napjatá jako start závodu.',
  'Oslavíte malý úspěch, který je důležitým krokem k velkému vítězství.',
];

const FALLBACK_HOROSCOPE_SCHOOL: string[] = [
  'Vaše argumenty budou dnes tak pádné, jako byste měli perfektní tahák.',
  'Očekávejte "zkoušku" z trpělivosti ve vztazích s přáteli.',
  'Nová informace, kterou získáte, bude klíčová pro váš budoucí úspěch.',
  'Finanční "domácí úkol" bude vyžadovat pečlivou přípravu, nepodceňte ho.',
  'Spolupráce na projektu přinese ovoce, ale bude třeba najít kompromis.',
  'Pocítíte se, jako byste přeskočili ročník – něco, co bylo složité, vám náhle bude jasné.',
  'Pozor na "poznámku" od nadřízeného, dbejte dnes na detaily.',
  'Váš kreativní přístup k problému vám vyslouží pochvalu jako jedničku s hvězdičkou.',
  'Někdo se vás pokusí "vyvolat" k odpovědi na nepříjemnou otázku. Buďte připraveni.',
  'Den je ideální pro "samostudium" – věnujte čas svému osobnímu rozvoji.',
  'Přátelský "referát" o vašich pocitech může pročistit vzduch ve vztahu.',
];


export const FALLBACK_POOLS: Record<Theme, string[]> = {
  [Theme.Universal]: FALLBACK_HOROSCOPE_UNIV,
  [Theme.F1]: FALLBACK_HOROSCOPE_F1,
  [Theme.School]: FALLBACK_HOROSCOPE_SCHOOL,
};

export const FALLBACK_SIGN_HOROSCOPE: Record<ZodiacSign, string[]> = {
  [ZodiacSign.Universal]: [],
  [ZodiacSign.Aries]: ['Vaše energie bude dnes strhující, ale snažte se ji usměrnit jedním směrem, abyste dosáhli cíle.', 'Nečekaná výzva prověří vaši přirozenou odvahu, přijměte ji.'],
  [ZodiacSign.Taurus]: ['Trpělivost dnes přinese ovoce, zvláště ve finančních záležitostech.', 'Dopřejte si chvilku klidu a pohodlí, pomůže vám to nabrat síly na další dny.'],
  [ZodiacSign.Gemini]: ['Vaše komunikační schopnosti budou na vrcholu, využijte je k vyřešení nedorozumění.', 'Nečekaná zpráva nebo setkání vám může otevřít nové dveře.'],
  [ZodiacSign.Cancer]: ['Zaměřte se na domov a rodinu, právě tam dnes najdete největší podporu a klid.', 'Vaše intuice ohledně pocitů druhých bude neomylná, pomůže vám to ve vztazích.'],
  [ZodiacSign.Leo]: ['Dostane se vám zasloužené pozornosti. Užívejte si ji, ale zůstaňte nohama na zemi.', 'Vaše velkorysost se vám dnes nečekaně vrátí.'],
  [ZodiacSign.Virgo]: ['Detail, který ostatní přehlédnou, bude pro vás klíčem k úspěchu.', 'Je skvělý den na organizaci a plánování, uděláte si pořádek nejen na stole, ale i v hlavě.'],
  [ZodiacSign.Libra]: ['Váš smysl pro spravedlnost pomůže urovnat spor ve vašem okolí.', 'Hledání rovnováhy mezi prací a odpočinkem bude dnes vaším hlavním tématem.'],
  [ZodiacSign.Scorpio]: ['Odhalíte skrytou informaci, která vám poskytne výhodu.', 'Vaše vášeň a odhodlání vám pomohou překonat překážku, která se zdála nepřekonatelná.'],
  [ZodiacSign.Sagittarius]: ['Váš optimismus bude nakažlivý a přitáhne k vám zajímavé lidi.', 'Naskytne se příležitost k malému dobrodružství, třeba i jen v myšlenkách nebo plánech.'],
  [ZodiacSign.Capricorn]: ['Vaše vytrvalost se konečně vyplatí v pracovní oblasti.', 'Dnes úspěšně dokončíte úkol, který jste dlouho odkládali, a pocítíte velkou úlevu.'],
  [ZodiacSign.Aquarius]: ['Váš originální a nekonvenční nápad získá nečekanou podporu.', 'Setkání s přáteli vám přinese inspiraci a novou perspektivu.'],
  [ZodiacSign.Pisces]: ['Naslouchejte svým snům a intuici, povedou vás správným směrem.', 'Vaše kreativita a představivost dnes nebudou znát hranic.'],
};


export const BINGO_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],           // diagonals
];

export const REWARDS = {
  BINGO: { XP: 60, COINS: 5 },
  FULL_BOARD: { XP: 120, COINS: 10 },
  REROLL_COST: 3,
};

export const xpForLevel = (level: number): number => 100 * level;

export const ACHIEVEMENT_EMOJIS: Record<AchievementId, string> = {
  [AchievementId.FirstBingo]: '🎉',
  [AchievementId.Streak3]: '🥉',
  [AchievementId.Streak7]: '🥈',
  [AchievementId.Streak30]: '🥇',
  [AchievementId.FullBoard]: '🏆',
  [AchievementId.Regen]: '🎲',
};