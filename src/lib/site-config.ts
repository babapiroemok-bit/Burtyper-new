/**
 * ============================================================
 * PLACEHOLDER VALUES — replace these with real data.
 * Search for "PLACEHOLDER" across the project to find them all.
 * ============================================================
 */

// Discord sunucu davet linki — tüm CTA butonları burayı kullanır.
export const DISCORD_INVITE = "https://discord.gg/8egH5kMQYB";

export const BRAND = {
  name: "Burtyper",
  tagline: "Discord bot ile hızlı ve güvenli satış.",
};

export const NAV_LINKS = [
  { label: "Nasıl Çalışır?", href: "#nasil-calisir" },
  { label: "Paketler", href: "#paketler" },
  { label: "Neden Biz?", href: "#neden-biz" },
  { label: "Yorumlar", href: "#yorumlar" },
  { label: "SSS", href: "#sss" },
];

export type Pkg = {
  amount: string;
  // PLACEHOLDER_PRICE — replace with real prices
  price: string;
  note: string;
  perks: string[];
  popular?: boolean;
  inStock?: boolean;
};

export const PACKAGES: Pkg[] = [
  {
    amount: "400 Robux",
    price: "Aktif!",
    note: "Küçük alımlar için ideal başlangıç",
    perks: ["Ortalama 5 dk teslimat", "Tek seferlik alım", "Discord destek kaydı"],
    inStock: true,
  },
  {
    amount: "800 Robux",
    price: "Aktif!",
    note: "En çok tercih edilen paket",
    perks: ["Öncelikli sırada işlem", "Ortalama 3 dk teslimat", "Ücretsiz sipariş takibi"],
    popular: true,
    inStock: true,
  },
  {
    amount: "1.700 Robux",
    price: "Aktif!",
    note: "Daha büyük alımlarda avantaj",
    perks: ["Öncelikli sırada işlem", "Toplu alım indirimi", "Kişiye özel destek kanalı"],
    inStock: true,
  },
  {
    amount: "4.500 Robux",
    price: "Aktif!",
    note: "Yüksek hacimli alıcılar için",
    perks: ["VIP sipariş kanalı", "Parçalı teslimat seçeneği", "Yetkiliyle birebir görüşme"],
    inStock: true,
  },
];

export type PaymentMethod = {
  name: string;
  note: string;
  enabled: boolean;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: "Discord Sunucusuna Boost", note: "Sunucuya boost basarak ödeme", enabled: true },
  { name: "Robux", note: "Güvenli eş zamanlı transfer", enabled: true },
  { name: "Takas", note: "Eş zamanlı takas yöntemi", enabled: true },
  { name: "Ownere Gift Nitro", note: "Owner'a Nitro hediye ederek ödeme", enabled: true },
];

export type FaqItem = {
  q: string;
  a: string;
};

export type Testimonial = {
  name: string;
  handle: string;
  rating: number;
  text: string;
};

// PLACEHOLDER_TESTIMONIALS — sample content, replace with real customer reviews.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Emre K.",
    handle: "@emrek",
    rating: 5,
    text: "Botla sipariş vermek gerçekten 1 dakika sürdü. Ödemeyi gönderdikten 4 dakika sonra bakiyem hesabımdaydı, hiç uğraşmadım.",
  },
  {
    name: "Zeynep A.",
    handle: "@zeynepa",
    rating: 5,
    text: "İlk defa alışveriş yaparken tedirgindim ama süreç adım adım anlatıldı. Şifremi kimse istemedi, bu benim için en önemlisiydi.",
  },
  {
    name: "Burak T.",
    handle: "@buraktt",
    rating: 5,
    text: "Gece 02:00'de sipariş verdim, yetkili anında döndü. 7/24 aktif olmaları gerçekten doğruymuş.",
  },
  {
    name: "Selin D.",
    handle: "@selind",
    rating: 4,
    text: "Fiyatlar piyasaya göre gayet makul. Üçüncü siparişim ve şimdiye kadar tek bir aksaklık yaşamadım.",
  },
  {
    name: "Mert Y.",
    handle: "@mertyz",
    rating: 5,
    text: "Toplu alım yaptım, parçalı teslimat önerdiler ve limitler yüzünden hiç sorun çıkmadı. Profesyonel iş.",
  },
  {
    name: "Deniz S.",
    handle: "@denizs",
    rating: 5,
    text: "Ödeme adımında ekran görüntüsü ile onay alınması içimi rahatlattı. Arkadaşlarıma da önerdim.",
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    a: "Dört ödeme yöntemiyle çalışıyoruz: (1) Discord sunucusuna boost basarak ödeme, (2) Robux, (3) Takas, (4) Owner'a Gift Nitro göndererek ödeme. Başka ödeme kanalı kullanmıyoruz; sipariş botu seçtiğin yönteme göre adımları otomatik olarak gösterir.",
  },
  {
    q: "Siparişim ne kadar sürede teslim edilir?",
    a: "Ödeme onayından sonra ortalama teslim süresi 3-10 dakikadır. Yoğun saatlerde veya yüksek tutarlı siparişlerde bu süre 30 dakikaya kadar çıkabilir; bu durumda yetkili seni Discord üzerinden bilgilendirir.",
  },
  {
    q: "Hesap şifremi paylaşmam gerekiyor mu?",
    a: "Hayır. Hiçbir koşulda şifre, e-posta parolası veya 2FA kodu istemiyoruz. Teslimat yöntemi için yalnızca kullanıcı adın ve gerekli durumlarda oyun içi ürün bağlantın yeterlidir. Şifre isteyen herkesi sahte kabul et ve yetkililere bildir.",
  },
  {
    q: "Sipariş sonrası iade veya iptal mümkün mü?",
    a: "Teslimat başlamadan önce iptal talebinde bulunursan ödemen eksiksiz iade edilir. Teslimat tamamlandıktan sonra dijital ürün niteliği gereği iade yapılamaz; ancak eksik teslimat durumunda fark anında tamamlanır.",
  },
  {
    q: "Minimum ve maksimum sipariş miktarı nedir?",
    a: "Minimum sipariş 400 Robux'tur. Tek seferde 10.000 Robux'a kadar işlem yapabilirsin. Daha yüksek tutarlar için yetkiliyle özel kanal açılır ve teslimat parçalar hâlinde planlanır.",
  },
  {
    q: "Sipariş botunu kullanmayı bilmiyorum, yardım alabilir miyim?",
    a: "Elbette. Sunucudaki #destek kanalından yazman yeterli; bir yetkili adım adım yönlendirir. Ayrıca #nasil-siparis-verilir kanalında görselli anlatım bulunur.",
  },
  {
    q: "Destek ekibine nasıl ulaşırım?",
    a: "Tüm iletişim Discord sunucumuz üzerinden yürür. Destek talebi oluşturduğunda ortalama 5 dakika içinde bir yetkili seninle ilgilenir. Destek ekibi 7/24 nöbetlidir.",
  },
  {
    q: "İşlemlerin güvenli olduğunu nasıl anlarım?",
    a: "Her sipariş, sunucuda otomatik açılan özel bir talep kanalında kayıt altına alınır. Ödeme onayı, teslimat zamanı ve yetkili bilgisi bu kanalda görünür. Ayrıca #teslimatlar kanalında geçmiş işlemleri inceleyebilirsin.",
  },
];
