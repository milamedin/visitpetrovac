import type { Locale } from './locales';

/**
 * UI string registry. Add new keys here and translate per locale.
 * If a translation is missing, falls back to the SR (default) string.
 */
export type StringKey =
  // Header / nav
  | 'nav.apartments'
  | 'nav.restaurants'
  | 'nav.tours'
  | 'nav.rentacar'
  | 'nav.guide'
  | 'nav.becomePartner'
  | 'nav.openMenu'
  | 'nav.closeMenu'
  | 'nav.languageMenu'
  // Hero (home)
  | 'hero.eyebrow'
  | 'hero.title.line1'
  | 'hero.title.line2'
  | 'hero.subtitle'
  | 'hero.search.placeholder'
  | 'hero.scroll'
  | 'hero.stat.objects'
  | 'hero.stat.commission'
  | 'hero.stat.instagram'
  // Home sections
  | 'home.explore.eyebrow'
  | 'home.explore.title.before'
  | 'home.explore.title.em'
  | 'home.explore.title.after'
  | 'home.explore.lead'
  | 'home.explore.cta'
  | 'home.cat.all'
  | 'home.why.eyebrow'
  | 'home.why.title.line1'
  | 'home.why.title.em'
  | 'home.why1.title'
  | 'home.why1.text'
  | 'home.why2.title'
  | 'home.why2.text'
  | 'home.why3.title'
  | 'home.why3.text'
  | 'home.cta.eyebrow'
  | 'home.cta.title'
  | 'home.cta.lead'
  | 'home.cta.button'
  // Footer
  | 'footer.tagline.line1'
  | 'footer.tagline.line2'
  | 'footer.section.categories'
  | 'footer.section.guide'
  | 'footer.section.platform'
  | 'footer.newsletter.label'
  | 'footer.newsletter.placeholder'
  | 'footer.newsletter.subscribe'
  | 'footer.copyright'
  | 'footer.guide.guideLink'
  | 'footer.platform.about'
  | 'footer.platform.becomePartner'
  | 'footer.platform.contact'
  | 'footer.platform.terms'
  | 'footer.platform.privacy'
  // Common
  | 'common.from'
  | 'common.unit.night'
  | 'common.unit.person'
  | 'common.unit.day'
  | 'common.unit.meal'
  | 'common.tag.premium'
  | 'common.tag.featured'
  | 'common.bookmark'
  | 'common.search.action'
  | 'common.skipToContent'
  | 'common.breadcrumbs.home'
  // Category page
  | 'cat.count.one'
  | 'cat.count.many'
  | 'cat.sort.recommended'
  | 'cat.sort.priceAsc'
  | 'cat.sort.priceDesc'
  | 'cat.sort.rating'
  | 'cat.sort.label'
  | 'cat.empty.title'
  | 'cat.empty.text'
  | 'cat.empty.cta'
  // Listing detail
  | 'listing.section.about'
  | 'listing.section.amenities'
  | 'listing.section.host'
  | 'listing.section.location'
  | 'listing.host.speaks'
  | 'listing.related.before'
  // Contact reveal
  | 'contact.priceLead'
  | 'contact.reveal'
  | 'contact.acceptTerms'
  | 'contact.label.phone'
  | 'contact.label.whatsapp'
  | 'contact.label.email'
  | 'contact.label.website'
  // Tour booking form
  | 'tour.title'
  | 'tour.lead'
  | 'tour.field.name'
  | 'tour.field.email'
  | 'tour.field.phone'
  | 'tour.field.date'
  | 'tour.field.persons'
  | 'tour.field.language'
  | 'tour.field.message'
  | 'tour.field.message.placeholder'
  | 'tour.submit'
  | 'tour.notice'
  | 'tour.success.title'
  | 'tour.success.text'
  | 'tour.error.text'
  | 'tour.error.retry'
  // Search page
  | 'search.title.empty'
  | 'search.title.results.before'
  | 'search.title.results.after'
  | 'search.title.noResults'
  | 'search.title.tooShort'
  | 'search.placeholder'
  | 'search.empty.text'
  | 'search.empty.allCta'
  | 'search.empty.homeCta'
  // 404
  | 'nf.title'
  | 'nf.lead'
  | 'nf.searchPlaceholder'
  | 'nf.cta.home'
  | 'nf.cta.all'
  // Blog
  | 'blog.eyebrow'
  | 'blog.title.before'
  | 'blog.title.em'
  | 'blog.lead'
  | 'blog.empty.title'
  | 'blog.empty.text'
  | 'blog.related'
  | 'blog.tags';

type StringMap = Record<StringKey, string>;

const sr: StringMap = {
  'nav.apartments': 'Smještaj',
  'nav.restaurants': 'Restorani i kafići',
  'nav.tours': 'Aktivnosti',
  'nav.rentacar': 'Rent-a-car',
  'nav.guide': 'Vodič',
  'nav.becomePartner': 'Postani partner',
  'nav.openMenu': 'Otvori meni',
  'nav.closeMenu': 'Zatvori meni',
  'nav.languageMenu': 'Promijeni jezik',

  'hero.eyebrow': 'Petrovac na Moru, Crna Gora',
  'hero.title.line1': 'Otkrij Petrovac na Moru',
  'hero.title.line2': 'kakav samo lokalci znaju',
  'hero.subtitle': 'Smještaj, restorani, aktivnosti i rent-a-car u Petrovcu na Moru. Direktan kontakt sa vlasnicima — bez provizije, bez posrednika.',
  'hero.search.placeholder': 'Šta tražiš u Petrovcu?',
  'hero.scroll': 'Istraži',
  'hero.stat.objects': 'provjerenih objekata',
  'hero.stat.commission': 'provizija',
  'hero.stat.instagram': 'na Instagramu',

  'home.explore.eyebrow': 'Istraži kategorije',
  'home.explore.title.before': 'Sve što ti treba za',
  'home.explore.title.em': 'savršen odmor',
  'home.explore.title.after': 'u Petrovcu',
  'home.explore.lead': 'Provjereni objekti, lokalni vlasnici, transparentne cijene. Klikni kategoriju ili kontaktiraj direktno.',
  'home.explore.cta': 'Pogledaj sav smještaj',
  'home.cat.all': 'Sve',
  'home.why.eyebrow': 'Zašto VisitPetrovac',
  'home.why.title.line1': 'Bez provizije. Bez posrednika.',
  'home.why.title.em': 'Direktno od domaćina.',
  'home.why1.title': '0% provizija',
  'home.why1.text': 'Nikad ti ne uzimamo procenat. Cijena koju vidiš je cijena koju plaćaš vlasniku — bez skrivenih troškova.',
  'home.why2.title': 'Direktan kontakt',
  'home.why2.text': 'Telefon, WhatsApp, email — biraš kako ćeš se javiti. Bez chat sistema, bez čekanja na potvrdu.',
  'home.why3.title': 'Lokalni domaćini',
  'home.why3.text': 'Svi vlasnici su Petrovčani. Najbolja preporuka za plažu, restoran, parking — uvijek dolazi od lokalca.',
  'home.cta.eyebrow': 'Za vlasnike',
  'home.cta.title': 'Imaš apartman, restoran ili izlet u Petrovcu?',
  'home.cta.lead': 'Pridruži se direktorijumu, dobij kvalitetan saobraćaj sa Google-a i Instagrama — fiksna godišnja pretplata, bez provizije.',
  'home.cta.button': 'Postani partner',

  'footer.tagline.line1': 'Nezavisni vodič kroz Petrovac na Moru.',
  'footer.tagline.line2': 'Rezerviši direktno od vlasnika — bez provizije.',
  'footer.section.categories': 'Kategorije',
  'footer.section.guide': 'Vodič',
  'footer.section.platform': 'O platformi',
  'footer.newsletter.label': 'Najnovije vijesti i ponude',
  'footer.newsletter.placeholder': 'tvoj@email.com',
  'footer.newsletter.subscribe': 'Pretplati se',
  'footer.copyright': 'Sva prava zadržana.',
  'footer.guide.guideLink': 'Vodič kroz Petrovac',
  'footer.platform.about': 'O nama',
  'footer.platform.becomePartner': 'Postani partner',
  'footer.platform.contact': 'Kontakt',
  'footer.platform.terms': 'Uslovi korišćenja',
  'footer.platform.privacy': 'Privatnost',

  'common.from': 'od',
  'common.unit.night': 'noć',
  'common.unit.person': 'osoba',
  'common.unit.day': 'dan',
  'common.unit.meal': 'obrok',
  'common.tag.premium': 'Premium',
  'common.tag.featured': 'Izdvojeno',
  'common.bookmark': 'Sačuvaj',
  'common.search.action': 'Pretraži',
  'common.skipToContent': 'Preskoči na sadržaj',
  'common.breadcrumbs.home': 'Početna',

  'cat.count.one': 'objekat',
  'cat.count.many': 'objekata',
  'cat.sort.recommended': 'Preporučeno',
  'cat.sort.priceAsc': 'Cijena ↑',
  'cat.sort.priceDesc': 'Cijena ↓',
  'cat.sort.rating': 'Najbolje ocijenjeno',
  'cat.sort.label': 'Sortiraj',
  'cat.empty.title': 'Još nemamo objavljenih objekata u ovoj kategoriji.',
  'cat.empty.text': 'Vrati se uskoro — dodajemo nove svake nedjelje.',
  'cat.empty.cta': 'Vrati se na početnu',

  'listing.section.about': 'O objektu',
  'listing.section.amenities': 'Šta nudi',
  'listing.section.host': 'Domaćin',
  'listing.section.location': 'Lokacija',
  'listing.host.speaks': 'Govori',
  'listing.related.before': 'Slični u kategoriji',

  'contact.priceLead': 'Kontaktiraj direktno vlasnika — bez provizije, bez čekanja na potvrdu.',
  'contact.reveal': 'Otkrij kontakt',
  'contact.acceptTerms': 'Otkrivanjem kontakta prihvataš uslove korišćenja.',
  'contact.label.phone': 'Telefon',
  'contact.label.whatsapp': 'WhatsApp',
  'contact.label.email': 'Email',
  'contact.label.website': 'Sajt',

  'tour.title': 'Rezerviši izlet',
  'tour.lead': 'Popuni formu i organizator će se javiti u toku dana sa potvrdom dostupnosti i tačnom cijenom.',
  'tour.field.name': 'Ime i prezime',
  'tour.field.email': 'Email',
  'tour.field.phone': 'Telefon',
  'tour.field.date': 'Datum izleta',
  'tour.field.persons': 'Broj osoba',
  'tour.field.language': 'Jezik komunikacije',
  'tour.field.message': 'Dodatne napomene',
  'tour.field.message.placeholder': 'Npr. ima li djece, alergija, posebnih zahtjeva...',
  'tour.submit': 'Pošalji upit',
  'tour.notice': 'Slanjem upita prihvataš uslove i politiku privatnosti.',
  'tour.success.title': 'Hvala! Upit je poslat.',
  'tour.success.text': 'Organizator izleta će ti se javiti danas, najčešće za sat-dva.',
  'tour.error.text': 'Nešto je pošlo po zlu.',
  'tour.error.retry': 'Pokušaj ponovo',

  'search.title.empty': 'Šta tražiš u Petrovcu?',
  'search.title.results.before': 'rezultata za',
  'search.title.results.after': '',
  'search.title.noResults': 'Nema rezultata za',
  'search.title.tooShort': 'Unesi bar 2 znaka',
  'search.placeholder': 'Pokušaj: apartman, riba, brod, parking...',
  'search.empty.text': 'Probaj sa drugim pojmovima ili pogledaj sve objekte po kategoriji.',
  'search.empty.allCta': 'Sve kategorije',
  'search.empty.homeCta': 'Vrati se na početnu',

  'nf.title': 'Ova stranica je zalutala kao turist u Buljarici.',
  'nf.lead': 'Link je pokvaren ili sadržaj više ne postoji. Probaj pretragu ili se vrati na početnu.',
  'nf.searchPlaceholder': 'Šta si tražio?',
  'nf.cta.home': 'Početna',
  'nf.cta.all': 'Svi objekti',

  'blog.eyebrow': 'Vodič',
  'blog.title.before': 'Petrovac,',
  'blog.title.em': 'iznutra',
  'blog.lead': 'Praktični vodiči, lokalni savjeti i sve što ti treba prije nego dođeš.',
  'blog.empty.title': 'Još nema objavljenih tekstova.',
  'blog.empty.text': 'Vraćamo se uskoro sa prvim vodičem.',
  'blog.related': 'Možda te zanima i',
  'blog.tags': 'Teme:',
};

const en: Partial<StringMap> = {
  'nav.apartments': 'Accommodation',
  'nav.restaurants': 'Restaurants & Cafés',
  'nav.tours': 'Activities',
  'nav.rentacar': 'Rent-a-car',
  'nav.guide': 'Guide',
  'nav.becomePartner': 'Become a partner',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.languageMenu': 'Change language',

  'hero.eyebrow': 'Petrovac, Montenegro',
  'hero.title.line1': 'Discover Petrovac',
  'hero.title.line2': 'like a local',
  'hero.subtitle': 'Apartments, restaurants, tours and rent-a-car. Direct contact with owners — no commission, no middlemen.',
  'hero.search.placeholder': 'What are you looking for in Petrovac?',
  'hero.scroll': 'Explore',
  'hero.stat.objects': 'verified listings',
  'hero.stat.commission': 'commission',
  'hero.stat.instagram': 'on Instagram',

  'home.explore.eyebrow': 'Browse categories',
  'home.explore.title.before': 'Everything you need for a',
  'home.explore.title.em': 'perfect holiday',
  'home.explore.title.after': 'in Petrovac',
  'home.explore.lead': 'Verified hosts, local owners, transparent prices. Pick a category or contact directly.',
  'home.explore.cta': 'See all accommodation',
  'home.cat.all': 'All',
  'home.why.eyebrow': 'Why VisitPetrovac',
  'home.why.title.line1': 'No commission. No middlemen.',
  'home.why.title.em': 'Straight from the host.',
  'home.why1.title': '0% commission',
  'home.why1.text': 'We never take a cut. The price you see is the price you pay the owner — no hidden fees.',
  'home.why2.title': 'Direct contact',
  'home.why2.text': 'Phone, WhatsApp, email — pick how to reach out. No chat systems, no waiting on confirmations.',
  'home.why3.title': 'Local hosts',
  'home.why3.text': 'All owners are from Petrovac. The best beach, restaurant, parking tip always comes from a local.',
  'home.cta.eyebrow': 'For owners',
  'home.cta.title': 'Have an apartment, restaurant or tour in Petrovac?',
  'home.cta.lead': 'Join the directory, get quality traffic from Google and Instagram — fixed yearly fee, no commission.',
  'home.cta.button': 'Become a partner',

  'footer.tagline.line1': 'Independent guide to Petrovac.',
  'footer.tagline.line2': 'Book direct from the owner — no commission.',
  'footer.section.categories': 'Categories',
  'footer.section.guide': 'Guide',
  'footer.section.platform': 'About',
  'footer.newsletter.label': 'Latest news and offers',
  'footer.newsletter.placeholder': 'your@email.com',
  'footer.newsletter.subscribe': 'Subscribe',
  'footer.copyright': 'All rights reserved.',
  'footer.guide.guideLink': 'Petrovac guide',
  'footer.platform.about': 'About us',
  'footer.platform.becomePartner': 'Become a partner',
  'footer.platform.contact': 'Contact',
  'footer.platform.terms': 'Terms of use',
  'footer.platform.privacy': 'Privacy',

  'common.from': 'from',
  'common.unit.night': 'night',
  'common.unit.person': 'person',
  'common.unit.day': 'day',
  'common.unit.meal': 'meal',
  'common.tag.premium': 'Premium',
  'common.tag.featured': 'Featured',
  'common.bookmark': 'Save',
  'common.search.action': 'Search',
  'common.skipToContent': 'Skip to content',
  'common.breadcrumbs.home': 'Home',

  'cat.count.one': 'listing',
  'cat.count.many': 'listings',
  'cat.sort.recommended': 'Recommended',
  'cat.sort.priceAsc': 'Price ↑',
  'cat.sort.priceDesc': 'Price ↓',
  'cat.sort.rating': 'Top rated',
  'cat.sort.label': 'Sort',
  'cat.empty.title': 'No listings published in this category yet.',
  'cat.empty.text': 'Check back soon — we add new ones every week.',
  'cat.empty.cta': 'Back to home',

  'listing.section.about': 'About',
  'listing.section.amenities': 'What it offers',
  'listing.section.host': 'Host',
  'listing.section.location': 'Location',
  'listing.host.speaks': 'Speaks',
  'listing.related.before': 'Similar in category',

  'contact.priceLead': 'Contact the owner directly — no commission, no waiting on confirmation.',
  'contact.reveal': 'Reveal contact',
  'contact.acceptTerms': 'By revealing the contact you accept the terms of use.',
  'contact.label.phone': 'Phone',
  'contact.label.whatsapp': 'WhatsApp',
  'contact.label.email': 'Email',
  'contact.label.website': 'Website',

  'tour.title': 'Book the tour',
  'tour.lead': 'Fill in the form and the organizer will reply the same day with availability and final price.',
  'tour.field.name': 'Full name',
  'tour.field.email': 'Email',
  'tour.field.phone': 'Phone',
  'tour.field.date': 'Tour date',
  'tour.field.persons': 'People',
  'tour.field.language': 'Language',
  'tour.field.message': 'Notes',
  'tour.field.message.placeholder': 'E.g. children, allergies, special requests...',
  'tour.submit': 'Send request',
  'tour.notice': 'By sending the request you accept the terms and privacy policy.',
  'tour.success.title': 'Thanks! Request sent.',
  'tour.success.text': 'The tour organizer will reply today, usually within an hour or two.',
  'tour.error.text': 'Something went wrong.',
  'tour.error.retry': 'Try again',

  'search.title.empty': 'What are you looking for in Petrovac?',
  'search.title.results.before': 'results for',
  'search.title.results.after': '',
  'search.title.noResults': 'No results for',
  'search.title.tooShort': 'Type at least 2 characters',
  'search.placeholder': 'Try: apartment, fish, boat, parking...',
  'search.empty.text': 'Try different keywords or browse all listings by category.',
  'search.empty.allCta': 'All categories',
  'search.empty.homeCta': 'Back to home',

  'nf.title': 'This page wandered off like a tourist in Buljarica.',
  'nf.lead': 'The link is broken or the content no longer exists. Try search or go back home.',
  'nf.searchPlaceholder': 'What were you looking for?',
  'nf.cta.home': 'Home',
  'nf.cta.all': 'All listings',

  'blog.eyebrow': 'Guide',
  'blog.title.before': 'Petrovac,',
  'blog.title.em': 'from inside',
  'blog.lead': 'Practical guides, local tips and everything you need before you arrive.',
  'blog.empty.title': 'No articles published yet.',
  'blog.empty.text': "We're back soon with the first guide.",
  'blog.related': 'You may also like',
  'blog.tags': 'Topics:',
};

const ru: Partial<StringMap> = {
  'nav.apartments': 'Размещение',
  'nav.restaurants': 'Рестораны и кафе',
  'nav.tours': 'Активности',
  'nav.rentacar': 'Аренда авто',
  'nav.guide': 'Гид',
  'nav.becomePartner': 'Стать партнёром',
  'nav.openMenu': 'Открыть меню',
  'nav.closeMenu': 'Закрыть меню',
  'nav.languageMenu': 'Сменить язык',

  'hero.eyebrow': 'Петровац, Черногория',
  'hero.title.line1': 'Откройте Петровац',
  'hero.title.line2': 'как местный житель',
  'hero.subtitle': 'Апартаменты, рестораны, экскурсии и прокат авто. Прямой контакт с владельцами — без комиссий, без посредников.',
  'hero.search.placeholder': 'Что ищете в Петроваце?',
  'hero.scroll': 'Смотреть',
  'hero.stat.objects': 'проверенных объектов',
  'hero.stat.commission': 'комиссия',
  'hero.stat.instagram': 'в Инстаграме',

  'home.explore.eyebrow': 'Категории',
  'home.explore.title.before': 'Всё для',
  'home.explore.title.em': 'идеального отдыха',
  'home.explore.title.after': 'в Петроваце',
  'home.explore.lead': 'Проверенные объекты, местные владельцы, прозрачные цены. Выберите категорию или свяжитесь напрямую.',
  'home.explore.cta': 'Все варианты размещения',
  'home.cat.all': 'Все',
  'home.why.eyebrow': 'Почему VisitPetrovac',
  'home.why.title.line1': 'Без комиссий. Без посредников.',
  'home.why.title.em': 'Напрямую от хозяина.',
  'home.why1.title': '0% комиссии',
  'home.why1.text': 'Мы никогда не берём процент. Цена, которую вы видите — это цена, которую платите владельцу. Без скрытых платежей.',
  'home.why2.title': 'Прямой контакт',
  'home.why2.text': 'Телефон, WhatsApp, email — выбирайте способ связи. Без чатов, без ожидания подтверждения.',
  'home.why3.title': 'Местные хозяева',
  'home.why3.text': 'Все владельцы — местные жители Петроваца. Лучший совет о пляже, ресторане или парковке всегда от местного.',
  'home.cta.eyebrow': 'Для владельцев',
  'home.cta.title': 'У вас есть апартамент, ресторан или экскурсия в Петроваце?',
  'home.cta.lead': 'Присоединяйтесь к каталогу и получайте качественный трафик с Google и Instagram — фиксированная годовая подписка, без комиссий.',
  'home.cta.button': 'Стать партнёром',

  'footer.tagline.line1': 'Независимый гид по Петровацу.',
  'footer.tagline.line2': 'Бронируйте напрямую — без комиссий.',
  'footer.section.categories': 'Категории',
  'footer.section.guide': 'Гид',
  'footer.section.platform': 'О платформе',
  'footer.newsletter.label': 'Новости и предложения',
  'footer.newsletter.placeholder': 'ваш@email.com',
  'footer.newsletter.subscribe': 'Подписаться',
  'footer.copyright': 'Все права защищены.',
  'footer.guide.guideLink': 'Гид по Петровацу',
  'footer.platform.about': 'О нас',
  'footer.platform.becomePartner': 'Стать партнёром',
  'footer.platform.contact': 'Контакты',
  'footer.platform.terms': 'Условия использования',
  'footer.platform.privacy': 'Конфиденциальность',

  'common.from': 'от',
  'common.unit.night': 'ночь',
  'common.unit.person': 'человек',
  'common.unit.day': 'день',
  'common.unit.meal': 'блюдо',
  'common.tag.premium': 'Премиум',
  'common.tag.featured': 'Избранное',
  'common.bookmark': 'Сохранить',
  'common.search.action': 'Найти',
  'common.skipToContent': 'Перейти к содержимому',
  'common.breadcrumbs.home': 'Главная',

  'cat.count.one': 'объект',
  'cat.count.many': 'объектов',
  'cat.sort.recommended': 'Рекомендуем',
  'cat.sort.priceAsc': 'Цена ↑',
  'cat.sort.priceDesc': 'Цена ↓',
  'cat.sort.rating': 'По рейтингу',
  'cat.sort.label': 'Сортировка',
  'cat.empty.title': 'В этой категории пока нет объектов.',
  'cat.empty.text': 'Загляните позже — мы добавляем новые каждую неделю.',
  'cat.empty.cta': 'На главную',

  'listing.section.about': 'Об объекте',
  'listing.section.amenities': 'Что включено',
  'listing.section.host': 'Хозяин',
  'listing.section.location': 'Локация',
  'listing.host.speaks': 'Говорит',
  'listing.related.before': 'Похожие в категории',

  'contact.priceLead': 'Свяжитесь с владельцем напрямую — без комиссий, без ожидания подтверждения.',
  'contact.reveal': 'Показать контакт',
  'contact.acceptTerms': 'Открывая контакт, вы принимаете условия использования.',
  'contact.label.phone': 'Телефон',
  'contact.label.whatsapp': 'WhatsApp',
  'contact.label.email': 'Email',
  'contact.label.website': 'Сайт',

  'tour.title': 'Забронировать экскурсию',
  'tour.lead': 'Заполните форму — организатор ответит в тот же день с подтверждением и точной ценой.',
  'tour.field.name': 'Имя и фамилия',
  'tour.field.email': 'Email',
  'tour.field.phone': 'Телефон',
  'tour.field.date': 'Дата экскурсии',
  'tour.field.persons': 'Количество человек',
  'tour.field.language': 'Язык общения',
  'tour.field.message': 'Заметки',
  'tour.field.message.placeholder': 'Напр.: дети, аллергии, особые пожелания...',
  'tour.submit': 'Отправить запрос',
  'tour.notice': 'Отправляя запрос, вы принимаете условия и политику конфиденциальности.',
  'tour.success.title': 'Спасибо! Запрос отправлен.',
  'tour.success.text': 'Организатор экскурсии свяжется с вами сегодня, обычно в течение часа-двух.',
  'tour.error.text': 'Что-то пошло не так.',
  'tour.error.retry': 'Попробовать снова',

  'search.title.empty': 'Что ищете в Петроваце?',
  'search.title.results.before': 'результатов по',
  'search.title.results.after': '',
  'search.title.noResults': 'Нет результатов по',
  'search.title.tooShort': 'Введите минимум 2 символа',
  'search.placeholder': 'Попробуйте: апартамент, рыба, лодка, парковка...',
  'search.empty.text': 'Попробуйте другие слова или посмотрите все объекты по категориям.',
  'search.empty.allCta': 'Все категории',
  'search.empty.homeCta': 'На главную',

  'nf.title': 'Эта страница заблудилась как турист в Бульярице.',
  'nf.lead': 'Ссылка повреждена или содержимое больше не существует. Попробуйте поиск или вернитесь на главную.',
  'nf.searchPlaceholder': 'Что вы искали?',
  'nf.cta.home': 'Главная',
  'nf.cta.all': 'Все объекты',

  'blog.eyebrow': 'Гид',
  'blog.title.before': 'Петровац,',
  'blog.title.em': 'изнутри',
  'blog.lead': 'Практические гиды, советы местных и всё, что нужно знать перед поездкой.',
  'blog.empty.title': 'Статьи пока не опубликованы.',
  'blog.empty.text': 'Скоро вернёмся с первым гидом.',
  'blog.related': 'Возможно вам понравится',
  'blog.tags': 'Темы:',
};

const de: Partial<StringMap> = {
  'nav.apartments': 'Unterkunft',
  'nav.restaurants': 'Restaurants & Cafés',
  'nav.tours': 'Aktivitäten',
  'nav.rentacar': 'Mietwagen',
  'nav.guide': 'Reiseführer',
  'nav.becomePartner': 'Partner werden',
  'nav.openMenu': 'Menü öffnen',
  'nav.closeMenu': 'Menü schließen',
  'nav.languageMenu': 'Sprache ändern',

  'hero.eyebrow': 'Petrovac, Montenegro',
  'hero.title.line1': 'Entdecke Petrovac',
  'hero.title.line2': 'wie ein Einheimischer',
  'hero.subtitle': 'Apartments, Restaurants, Ausflüge und Mietwagen. Direkter Kontakt zu den Eigentümern — ohne Provision, ohne Vermittler.',
  'hero.search.placeholder': 'Was suchst du in Petrovac?',
  'hero.scroll': 'Entdecken',
  'hero.stat.objects': 'geprüfte Objekte',
  'hero.stat.commission': 'Provision',
  'hero.stat.instagram': 'auf Instagram',

  'home.explore.eyebrow': 'Kategorien',
  'home.explore.title.before': 'Alles für deinen',
  'home.explore.title.em': 'perfekten Urlaub',
  'home.explore.title.after': 'in Petrovac',
  'home.explore.lead': 'Geprüfte Objekte, lokale Eigentümer, transparente Preise. Wähle eine Kategorie oder kontaktiere direkt.',
  'home.explore.cta': 'Alle Unterkünfte',
  'home.cat.all': 'Alle',
  'home.why.eyebrow': 'Warum VisitPetrovac',
  'home.why.title.line1': 'Keine Provision. Kein Vermittler.',
  'home.why.title.em': 'Direkt vom Gastgeber.',
  'home.why1.title': '0% Provision',
  'home.why1.text': 'Wir nehmen nie einen Anteil. Der Preis, den du siehst, ist der Preis, den du zahlst — keine versteckten Kosten.',
  'home.why2.title': 'Direkter Kontakt',
  'home.why2.text': 'Telefon, WhatsApp, E-Mail — du wählst, wie du dich meldest. Kein Chat-System, keine Wartezeit.',
  'home.why3.title': 'Lokale Gastgeber',
  'home.why3.text': 'Alle Eigentümer kommen aus Petrovac. Die besten Tipps für Strand, Restaurant oder Parkplatz kommen immer vom Einheimischen.',
  'home.cta.eyebrow': 'Für Eigentümer',
  'home.cta.title': 'Hast du ein Apartment, Restaurant oder Ausflug in Petrovac?',
  'home.cta.lead': 'Tritt dem Verzeichnis bei, erhalte qualifizierten Traffic von Google und Instagram — fester Jahresbeitrag, keine Provision.',
  'home.cta.button': 'Partner werden',

  'footer.tagline.line1': 'Unabhängiger Reiseführer für Petrovac.',
  'footer.tagline.line2': 'Direkt beim Eigentümer buchen — ohne Provision.',
  'footer.section.categories': 'Kategorien',
  'footer.section.guide': 'Reiseführer',
  'footer.section.platform': 'Über uns',
  'footer.newsletter.label': 'Neuigkeiten und Angebote',
  'footer.newsletter.placeholder': 'deine@email.com',
  'footer.newsletter.subscribe': 'Abonnieren',
  'footer.copyright': 'Alle Rechte vorbehalten.',
  'footer.guide.guideLink': 'Petrovac Reiseführer',
  'footer.platform.about': 'Über uns',
  'footer.platform.becomePartner': 'Partner werden',
  'footer.platform.contact': 'Kontakt',
  'footer.platform.terms': 'Nutzungsbedingungen',
  'footer.platform.privacy': 'Datenschutz',

  'common.from': 'ab',
  'common.unit.night': 'Nacht',
  'common.unit.person': 'Person',
  'common.unit.day': 'Tag',
  'common.unit.meal': 'Gericht',
  'common.tag.premium': 'Premium',
  'common.tag.featured': 'Empfohlen',
  'common.bookmark': 'Speichern',
  'common.search.action': 'Suchen',
  'common.skipToContent': 'Zum Inhalt',
  'common.breadcrumbs.home': 'Startseite',

  'cat.count.one': 'Objekt',
  'cat.count.many': 'Objekte',
  'cat.sort.recommended': 'Empfohlen',
  'cat.sort.priceAsc': 'Preis ↑',
  'cat.sort.priceDesc': 'Preis ↓',
  'cat.sort.rating': 'Beste Bewertung',
  'cat.sort.label': 'Sortieren',
  'cat.empty.title': 'In dieser Kategorie sind noch keine Objekte veröffentlicht.',
  'cat.empty.text': 'Schau bald wieder vorbei — jede Woche kommen neue dazu.',
  'cat.empty.cta': 'Zur Startseite',

  'listing.section.about': 'Über das Objekt',
  'listing.section.amenities': 'Ausstattung',
  'listing.section.host': 'Gastgeber',
  'listing.section.location': 'Lage',
  'listing.host.speaks': 'Spricht',
  'listing.related.before': 'Ähnliche in Kategorie',

  'contact.priceLead': 'Kontaktiere den Eigentümer direkt — ohne Provision, ohne Wartezeit.',
  'contact.reveal': 'Kontakt anzeigen',
  'contact.acceptTerms': 'Mit dem Anzeigen des Kontakts akzeptierst du die Nutzungsbedingungen.',
  'contact.label.phone': 'Telefon',
  'contact.label.whatsapp': 'WhatsApp',
  'contact.label.email': 'E-Mail',
  'contact.label.website': 'Website',

  'tour.title': 'Ausflug buchen',
  'tour.lead': 'Fülle das Formular aus und der Veranstalter meldet sich am selben Tag mit Verfügbarkeit und endgültigem Preis.',
  'tour.field.name': 'Vor- und Nachname',
  'tour.field.email': 'E-Mail',
  'tour.field.phone': 'Telefon',
  'tour.field.date': 'Ausflugsdatum',
  'tour.field.persons': 'Personen',
  'tour.field.language': 'Sprache',
  'tour.field.message': 'Anmerkungen',
  'tour.field.message.placeholder': 'Z.B. Kinder, Allergien, besondere Wünsche...',
  'tour.submit': 'Anfrage senden',
  'tour.notice': 'Mit dem Senden akzeptierst du Bedingungen und Datenschutz.',
  'tour.success.title': 'Danke! Anfrage gesendet.',
  'tour.success.text': 'Der Veranstalter meldet sich heute, meist innerhalb von ein bis zwei Stunden.',
  'tour.error.text': 'Etwas ist schiefgelaufen.',
  'tour.error.retry': 'Erneut versuchen',

  'search.title.empty': 'Was suchst du in Petrovac?',
  'search.title.results.before': 'Ergebnisse für',
  'search.title.results.after': '',
  'search.title.noResults': 'Keine Ergebnisse für',
  'search.title.tooShort': 'Mindestens 2 Zeichen eingeben',
  'search.placeholder': 'Versuche: Apartment, Fisch, Boot, Parkplatz...',
  'search.empty.text': 'Versuche andere Begriffe oder durchsuche alle Objekte nach Kategorie.',
  'search.empty.allCta': 'Alle Kategorien',
  'search.empty.homeCta': 'Zur Startseite',

  'nf.title': 'Diese Seite hat sich verirrt wie ein Tourist in Buljarica.',
  'nf.lead': 'Der Link ist defekt oder der Inhalt existiert nicht mehr. Versuche die Suche oder kehre zur Startseite zurück.',
  'nf.searchPlaceholder': 'Wonach hast du gesucht?',
  'nf.cta.home': 'Startseite',
  'nf.cta.all': 'Alle Objekte',

  'blog.eyebrow': 'Reiseführer',
  'blog.title.before': 'Petrovac,',
  'blog.title.em': 'von innen',
  'blog.lead': 'Praktische Reiseführer, lokale Tipps und alles, was du vor der Anreise wissen musst.',
  'blog.empty.title': 'Noch keine Artikel veröffentlicht.',
  'blog.empty.text': 'Wir sind bald mit dem ersten Reiseführer zurück.',
  'blog.related': 'Das könnte dir auch gefallen',
  'blog.tags': 'Themen:',
};

const fr: Partial<StringMap> = {
  'nav.apartments': 'Hébergement',
  'nav.restaurants': 'Restaurants & cafés',
  'nav.tours': 'Activités',
  'nav.rentacar': 'Location de voiture',
  'nav.guide': 'Guide',
  'nav.becomePartner': 'Devenir partenaire',
  'nav.openMenu': 'Ouvrir le menu',
  'nav.closeMenu': 'Fermer le menu',
  'nav.languageMenu': 'Changer de langue',

  'hero.eyebrow': 'Petrovac, Monténégro',
  'hero.title.line1': 'Découvre Petrovac',
  'hero.title.line2': "comme un local",
  'hero.subtitle': 'Appartements, restaurants, excursions et location de voiture. Contact direct avec les propriétaires — sans commission, sans intermédiaire.',
  'hero.search.placeholder': 'Que cherches-tu à Petrovac ?',
  'hero.scroll': 'Explorer',
  'hero.stat.objects': 'objets vérifiés',
  'hero.stat.commission': 'commission',
  'hero.stat.instagram': 'sur Instagram',

  'home.explore.eyebrow': 'Catégories',
  'home.explore.title.before': 'Tout ce qu’il te faut pour des',
  'home.explore.title.em': 'vacances parfaites',
  'home.explore.title.after': 'à Petrovac',
  'home.explore.lead': 'Objets vérifiés, propriétaires locaux, prix transparents. Choisis une catégorie ou contacte directement.',
  'home.explore.cta': 'Voir tous les hébergements',
  'home.cat.all': 'Tous',
  'home.why.eyebrow': 'Pourquoi VisitPetrovac',
  'home.why.title.line1': 'Sans commission. Sans intermédiaire.',
  'home.why.title.em': 'Directement chez l’hôte.',
  'home.why1.title': '0 % commission',
  'home.why1.text': 'Nous ne prenons jamais de pourcentage. Le prix affiché est le prix payé au propriétaire — sans frais cachés.',
  'home.why2.title': 'Contact direct',
  'home.why2.text': 'Téléphone, WhatsApp, e-mail — choisis ton mode de contact. Pas de chat, pas d’attente de confirmation.',
  'home.why3.title': 'Hôtes locaux',
  'home.why3.text': 'Tous les propriétaires sont de Petrovac. La meilleure recommandation pour la plage, le restaurant, le parking vient toujours d’un local.',
  'home.cta.eyebrow': 'Pour les propriétaires',
  'home.cta.title': 'Tu as un appartement, restaurant ou une excursion à Petrovac ?',
  'home.cta.lead': 'Rejoins l’annuaire, obtiens du trafic qualifié depuis Google et Instagram — abonnement annuel fixe, sans commission.',
  'home.cta.button': 'Devenir partenaire',

  'footer.tagline.line1': 'Guide indépendant de Petrovac.',
  'footer.tagline.line2': 'Réserve directement chez le propriétaire — sans commission.',
  'footer.section.categories': 'Catégories',
  'footer.section.guide': 'Guide',
  'footer.section.platform': 'À propos',
  'footer.newsletter.label': 'Actualités et offres',
  'footer.newsletter.placeholder': 'ton@email.com',
  'footer.newsletter.subscribe': 'S’abonner',
  'footer.copyright': 'Tous droits réservés.',
  'footer.guide.guideLink': 'Guide Petrovac',
  'footer.platform.about': 'À propos',
  'footer.platform.becomePartner': 'Devenir partenaire',
  'footer.platform.contact': 'Contact',
  'footer.platform.terms': "Conditions d'utilisation",
  'footer.platform.privacy': 'Confidentialité',

  'common.from': 'à partir de',
  'common.unit.night': 'nuit',
  'common.unit.person': 'personne',
  'common.unit.day': 'jour',
  'common.unit.meal': 'repas',
  'common.tag.premium': 'Premium',
  'common.tag.featured': 'En vedette',
  'common.bookmark': 'Enregistrer',
  'common.search.action': 'Rechercher',
  'common.skipToContent': 'Aller au contenu',
  'common.breadcrumbs.home': 'Accueil',

  'cat.count.one': 'objet',
  'cat.count.many': 'objets',
  'cat.sort.recommended': 'Recommandé',
  'cat.sort.priceAsc': 'Prix ↑',
  'cat.sort.priceDesc': 'Prix ↓',
  'cat.sort.rating': 'Meilleure note',
  'cat.sort.label': 'Trier',
  'cat.empty.title': "Aucun objet publié dans cette catégorie pour l'instant.",
  'cat.empty.text': 'Reviens bientôt — nous en ajoutons chaque semaine.',
  'cat.empty.cta': "Retour à l'accueil",

  'listing.section.about': 'À propos',
  'listing.section.amenities': "Ce qu'il offre",
  'listing.section.host': 'Hôte',
  'listing.section.location': 'Emplacement',
  'listing.host.speaks': 'Parle',
  'listing.related.before': 'Similaires dans la catégorie',

  'contact.priceLead': "Contacte le propriétaire directement — sans commission, sans attente de confirmation.",
  'contact.reveal': 'Voir le contact',
  'contact.acceptTerms': "En affichant le contact tu acceptes les conditions d'utilisation.",
  'contact.label.phone': 'Téléphone',
  'contact.label.whatsapp': 'WhatsApp',
  'contact.label.email': 'E-mail',
  'contact.label.website': 'Site web',

  'tour.title': 'Réserver l’excursion',
  'tour.lead': 'Remplis le formulaire et l’organisateur te répondra le jour même avec disponibilité et prix final.',
  'tour.field.name': 'Nom complet',
  'tour.field.email': 'E-mail',
  'tour.field.phone': 'Téléphone',
  'tour.field.date': 'Date',
  'tour.field.persons': 'Personnes',
  'tour.field.language': 'Langue',
  'tour.field.message': 'Notes',
  'tour.field.message.placeholder': 'Ex. : enfants, allergies, demandes spéciales...',
  'tour.submit': 'Envoyer la demande',
  'tour.notice': 'En envoyant tu acceptes les conditions et la politique de confidentialité.',
  'tour.success.title': 'Merci ! Demande envoyée.',
  'tour.success.text': 'L’organisateur te répondra aujourd’hui, généralement en une à deux heures.',
  'tour.error.text': 'Quelque chose s’est mal passé.',
  'tour.error.retry': 'Réessayer',

  'search.title.empty': 'Que cherches-tu à Petrovac ?',
  'search.title.results.before': 'résultats pour',
  'search.title.results.after': '',
  'search.title.noResults': 'Aucun résultat pour',
  'search.title.tooShort': 'Tape au moins 2 caractères',
  'search.placeholder': 'Essaie : appartement, poisson, bateau, parking...',
  'search.empty.text': "Essaie d'autres mots ou parcours tous les objets par catégorie.",
  'search.empty.allCta': 'Toutes les catégories',
  'search.empty.homeCta': "Retour à l'accueil",

  'nf.title': "Cette page s'est perdue comme un touriste à Buljarica.",
  'nf.lead': "Le lien est cassé ou le contenu n'existe plus. Essaie la recherche ou retourne à l'accueil.",
  'nf.searchPlaceholder': 'Que cherchais-tu ?',
  'nf.cta.home': 'Accueil',
  'nf.cta.all': 'Tous les objets',

  'blog.eyebrow': 'Guide',
  'blog.title.before': 'Petrovac,',
  'blog.title.em': 'de l’intérieur',
  'blog.lead': 'Guides pratiques, conseils locaux et tout ce qu’il faut savoir avant d’arriver.',
  'blog.empty.title': "Aucun article publié pour l'instant.",
  'blog.empty.text': 'Nous revenons bientôt avec le premier guide.',
  'blog.related': 'Tu pourrais aussi aimer',
  'blog.tags': 'Sujets :',
};

const dictionaries: Record<Locale, StringMap | Partial<StringMap>> = { sr, en, ru, de, fr };

export function t(key: StringKey, locale: Locale): string {
  const dict = dictionaries[locale] as Partial<StringMap>;
  return dict[key] ?? sr[key];
}

export type { StringMap };
