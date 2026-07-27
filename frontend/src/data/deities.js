// Deities data - Sanskrit + multi-language transliteration & meaning.
// Each deity has: id, name (multi-lang), image (unsplash CC), color accent,
// mula_mantra, dhyana_sloka, popular_stotras, ashtottara (108 names sample), sahasranama (title only).

const IMG = {
  ganesha:
    "https://images.unsplash.com/photo-1631981245670-9bd0f2fbcd12?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxnYW5lc2hhfGVufDB8fHx8MTc4NTAyNjUxOHww&ixlib=rb-4.1.0&q=85&w=800",
  shiva:
    "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxzaGl2YXxlbnwwfHx8fDE3ODUwMjY1MTh8MA&ixlib=rb-4.1.0&q=85&w=800",
  vishnu:
    "https://images.unsplash.com/photo-1621112904887-419379ce6824?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHx2aXNobnV8ZW58MHx8fHwxNzg1MDI2NTE4fDA&ixlib=rb-4.1.0&q=85&w=800",
  krishna:
    "https://images.unsplash.com/photo-1701444729317-14ce4c3a9948?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxrcmlzaG5hfGVufDB8fHx8MTc4NTAyNjUxOHww&ixlib=rb-4.1.0&q=85&w=800",
  rama:
    "https://images.unsplash.com/photo-1728737581415-a70dc826b90a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxyYW1hfGVufDB8fHx8MTc4NTAyNjUxOHww&ixlib=rb-4.1.0&q=85&w=800",
  hanuman:
    "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxoYW51bWFufGVufDB8fHx8MTc4NTAyNjUxOHww&ixlib=rb-4.1.0&q=85&w=800",
  lakshmi:
    "https://images.unsplash.com/photo-1666185846203-f7a72b3fbf34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxsYWtzaG1pfGVufDB8fHx8MTc4NTAyNjUxOHww&ixlib=rb-4.1.0&q=85&w=800",
  saraswati:
    "https://images.unsplash.com/photo-1697577418992-c8e084ea0eeb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxzYXJhc3dhdGl8ZW58MHx8fHwxNzg1MDI2NTE4fDA&ixlib=rb-4.1.0&q=85&w=800",
  durga:
    "https://images.unsplash.com/photo-1601301909948-b8a2bc21a2b8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxkdXJnYXxlbnwwfHx8fDE3ODUwMjY1MTh8MA&ixlib=rb-4.1.0&q=85&w=800",
  subrahmanya:
    "https://images.unsplash.com/photo-1590125060821-4b1d18b6b6b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxtdXJ1Z2FufGVufDB8fHx8MTc4NTAyNjUxOHww&ixlib=rb-4.1.0&q=85&w=800",
  surya:
    "https://images.unsplash.com/photo-1541873676-a18131494184?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxzdW58ZW58MHx8fHwxNzg1MDI2NTE4fDA&ixlib=rb-4.1.0&q=85&w=800",
  ayyappa:
    "https://images.unsplash.com/photo-1580889272861-dc2dbf9ebbf5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxheXlhcHBhfGVufDB8fHx8MTc4NTAyNjUxOHww&ixlib=rb-4.1.0&q=85&w=800",
};

// Generic royalty-free devotional audio (Archive.org public domain)
const A = {
  om: "https://archive.org/download/OmChanting108Times/Om%20Chanting%20108%20Times.mp3",
  ganesha: "https://archive.org/download/GanapatiAtharvashirsha_201802/Ganapati%20Atharvashirsha.mp3",
  gayatri: "https://archive.org/download/GayatriMantra108Times/Gayatri%20Mantra%20108%20Times.mp3",
  mahamrityunjaya:
    "https://archive.org/download/mahamrityunjaya-mantra-108-times/Mahamrityunjaya%20Mantra%20108%20Times.mp3",
  hanuman:
    "https://archive.org/download/HanumanChalisa_201802/Hanuman%20Chalisa.mp3",
  vishnu: "https://archive.org/download/VishnuSahasranamamMSSubbulakshmi/Vishnu%20Sahasranamam.mp3",
  lalita: "https://archive.org/download/LalithaSahasranamam/Lalitha%20Sahasranamam.mp3",
};

export const BACKGROUND_CHANTS = [
  { id: "om", label: "Om Chanting (108 times)", url: A.om },
  { id: "gayatri", label: "Gāyatrī Mantra", url: A.gayatri },
  { id: "mahamrityunjaya", label: "Mahā Mṛtyuñjaya Mantra", url: A.mahamrityunjaya },
  { id: "hanuman", label: "Hanumān Chālīsā", url: A.hanuman },
  { id: "vishnu", label: "Viṣṇu Sahasranāmam", url: A.vishnu },
  { id: "lalita", label: "Lalitā Sahasranāmam", url: A.lalita },
];

// helper builder
const d = (id, names, color, mula, dhyana, meaning, stotras, ashtot, songs) => ({
  id, name: names, color, mula_mantra: mula, dhyana_sloka: dhyana, meaning,
  stotras, ashtottara_sample: ashtot, songs,
  image: IMG[id],
});

export const DEITIES = [
  d("ganesha",
    { en: "Ganesha", te: "గణేశ", hi: "गणेश", ta: "விநாயகர்", sa: "गणेशः" },
    "#FF9933",
    { sa: "ॐ गं गणपतये नमः", en: "Om Gaṁ Gaṇapataye Namaḥ", meaning: { en: "Salutations to Lord Ganapati, remover of obstacles.", te: "విఘ్నహర్త గణపతికి నమస్కారం.", hi: "विघ्नहर्ता गणपति को नमन।", ta: "விக்நஹர்த்தா கணபதிக்கு நமஸ்காரம்." } },
    "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥",
    { en: "One who wears white garments, all-pervading, moon-hued, four-armed, with a serene face — I meditate on him for the removal of all obstacles." },
    ["Gaṇapati Atharvaśīrṣa", "Saṅkaṭanāśana Gaṇeśa Stotram", "Gaṇeśa Pañcaratnam", "Mahā Gaṇapati Stotram"],
    ["Vināyaka", "Vighneśvara", "Gaṇādhipa", "Ekadanta", "Heramba", "Lambodara", "Śūrpakarṇa", "Gajānana", "Vakratuṇḍa", "Dhūmravarṇa", "Siddhivināyaka", "Buddhipriya"],
    [{ title: "Ganapati Atharvashirsha", url: A.ganesha }]
  ),
  d("shiva",
    { en: "Shiva", te: "శివ", hi: "शिव", ta: "சிவன்", sa: "शिवः" },
    "#0B1021",
    { sa: "ॐ नमः शिवाय", en: "Om Namaḥ Śivāya", meaning: { en: "Salutations to Lord Shiva, the auspicious one.", te: "మంగళప్రదాతైన శివునికి నమస్కారం.", hi: "मंगलमय शिव को नमन।", ta: "மங்கள ஸ்வரூபியான சிவனுக்கு நமஸ்காரம்." } },
    "कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्।\nसदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥",
    { en: "Camphor-white, embodiment of compassion, essence of existence, garlanded with serpents — I bow to Bhava with Bhavani, ever residing in the lotus of my heart." },
    ["Śiva Tāṇḍava Stotram", "Liṅgāṣṭakam", "Bilvāṣṭakam", "Rudram Chamakam", "Śiva Mānasa Pūjā"],
    ["Śambhu", "Śaṅkara", "Maheśvara", "Nīlakaṇṭha", "Umāpati", "Tripurāntaka", "Naṭarāja", "Someśvara", "Gaṅgādhara", "Bhūteśa", "Candraśekhara", "Paśupati"],
    [{ title: "Mahamrityunjaya Mantra 108x", url: A.mahamrityunjaya }]
  ),
  d("vishnu",
    { en: "Vishnu", te: "విష్ణు", hi: "विष्णु", ta: "விஷ்ணு", sa: "विष्णुः" },
    "#0F4C81",
    { sa: "ॐ नमो नारायणाय", en: "Om Namo Nārāyaṇāya", meaning: { en: "Salutations to Lord Narayana, the sustainer.", te: "సర్వసంరక్షకుడైన నారాయణుడికి నమస్కారం.", hi: "पालनहार नारायण को नमन।", ta: "பாதுகாவலரான நாராயணருக்கு நமஸ்காரம்." } },
    "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं।\nविश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्॥",
    { en: "Of peaceful form, reclining on the serpent Ananta, lotus-naveled, Lord of Devas, supporter of the universe, sky-vast, cloud-hued and auspicious-limbed — I meditate on Vishnu." },
    ["Viṣṇu Sahasranāma", "Nārāyaṇa Sūktam", "Puruṣa Sūktam", "Madhurāṣṭakam"],
    ["Nārāyaṇa", "Hari", "Keśava", "Mādhava", "Govinda", "Madhusūdana", "Trivikrama", "Vāmana", "Śrīdhara", "Hṛṣīkeśa", "Padmanābha", "Dāmodara"],
    [{ title: "Vishnu Sahasranamam", url: A.vishnu }]
  ),
  d("krishna",
    { en: "Krishna", te: "కృష్ణ", hi: "कृष्ण", ta: "கிருஷ்ணர்", sa: "कृष्णः" },
    "#1E3A8A",
    { sa: "ॐ क्लीं कृष्णाय नमः", en: "Om Klīṁ Kṛṣṇāya Namaḥ", meaning: { en: "Salutations to Lord Krishna.", te: "కృష్ణుడికి నమస్కారం.", hi: "श्रीकृष्ण को नमन।", ta: "க்ருஷ்ணனுக்கு நமஸ்காரம்." } },
    "वसुदेवसुतं देवं कंसचाणूरमर्दनम्।\nदेवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम्॥",
    { en: "Son of Vasudeva, slayer of Kamsa and Chanura, supreme joy of Devaki — I bow to Krishna, the world-teacher." },
    ["Madhurāṣṭakam", "Kṛṣṇāṣṭakam", "Bhagavad Gītā", "Gopāla Sahasranāma"],
    ["Govinda", "Gopāla", "Vāsudeva", "Mādhava", "Girīdhara", "Muralīdhara", "Yaśodānandana", "Nandagopa", "Damodara", "Keśava"],
    []
  ),
  d("rama",
    { en: "Rama", te: "రామ", hi: "राम", ta: "ராமர்", sa: "रामः" },
    "#065F46",
    { sa: "ॐ श्री रामाय नमः", en: "Om Śrī Rāmāya Namaḥ", meaning: { en: "Salutations to Lord Rama.", te: "శ్రీరాముడికి నమస్కారం.", hi: "श्रीराम को नमन।", ta: "ஸ்ரீராமருக்கு நமஸ்காரம்." } },
    "आपदामपहर्तारं दातारं सर्वसंपदाम्।\nलोकाभिरामं श्रीरामं भूयो भूयो नमाम्यहम्॥",
    { en: "Remover of calamities, bestower of every prosperity, delighter of the worlds — I bow again and again to Sri Rama." },
    ["Rāma Rakṣā Stotram", "Rāma Aṣṭottara", "Śrī Rāma Sahasranāma"],
    ["Rāma", "Rāghava", "Kausalyānandana", "Sītāpati", "Kodaṇḍarāma", "Raghunandana", "Dāśarathi", "Maryādāpuruṣottama"],
    []
  ),
  d("hanuman",
    { en: "Hanuman", te: "హనుమాన్", hi: "हनुमान", ta: "அனுமான்", sa: "हनुमान्" },
    "#B91C1C",
    { sa: "ॐ हं हनुमते नमः", en: "Om Haṁ Hanumate Namaḥ", meaning: { en: "Salutations to Sri Hanuman.", te: "హనుమంతునికి నమస్కారం.", hi: "हनुमान जी को नमन।", ta: "ஹனுமானுக்கு நமஸ்காரம்." } },
    "मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।\nवातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥",
    { en: "Swift as thought, equal to wind in speed, master of senses, foremost of the wise, wind-born, leader of monkeys, messenger of Rama — I take refuge in him." },
    ["Hanumān Chālīsā", "Hanumat Sahasranāma", "Bajaraṅga Bāṇa", "Sundarakāṇḍa"],
    ["Añjaneya", "Bajaraṅga", "Māruti", "Pavanaputra", "Kesarīnandana", "Rāmadūta", "Mahāvīra", "Saṅkaṭamocana"],
    [{ title: "Hanuman Chalisa", url: A.hanuman }]
  ),
  d("lakshmi",
    { en: "Lakshmi", te: "లక్ష్మి", hi: "लक्ष्मी", ta: "லக்ஷ்மி", sa: "लक्ष्मीः" },
    "#EC4899",
    { sa: "ॐ श्रीं महालक्ष्म्यै नमः", en: "Om Śrīṁ Mahālakṣmyai Namaḥ", meaning: { en: "Salutations to Goddess Mahalakshmi.", te: "మహాలక్ష్మీ మాతకు నమస్కారం.", hi: "महालक्ष्मी को नमन।", ta: "மகாலக்ஷ்மிக்கு நமஸ்காரம்." } },
    "पद्मासने पद्मकरे सर्वलोकैकपूजिते।\nनारायणप्रिये देवि सुप्रीता भव सर्वदा॥",
    { en: "Seated on the lotus, lotus in hand, worshipped by all worlds, dear to Narayana — O Devi, be ever gracious to me." },
    ["Śrī Sūktam", "Mahālakṣmī Aṣṭakam", "Kanakadhārā Stotram", "Lakṣmī Sahasranāma"],
    ["Śrī", "Padmā", "Kamalā", "Ramā", "Padmapriyā", "Padmahastā", "Vaiṣṇavī", "Dhanadā"],
    []
  ),
  d("saraswati",
    { en: "Saraswati", te: "సరస్వతి", hi: "सरस्वती", ta: "ஸரஸ்வதி", sa: "सरस्वती" },
    "#F5F5DC",
    { sa: "ॐ ऐं सरस्वत्यै नमः", en: "Om Aim Sarasvatyai Namaḥ", meaning: { en: "Salutations to Goddess Saraswati.", te: "సరస్వతీ మాతకు నమస్కారం.", hi: "सरस्वती माँ को नमन।", ta: "ஸரஸ்வதிக்கு நமஸ்காரம்." } },
    "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता।\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥",
    { en: "She who is white as jasmine, moon and snow, clad in white, hands adorned with veena and vara-mudra, seated on a white lotus — I salute Saraswati." },
    ["Sarasvatī Aṣṭakam", "Sarasvatī Stotram", "Śāradā Bhujaṅgam"],
    ["Śāradā", "Vīṇāpāṇi", "Bhāratī", "Vāgdevī", "Brāhmī", "Mahāvidyā", "Śāstravidhāyinī"],
    []
  ),
  d("durga",
    { en: "Durga", te: "దుర్గ", hi: "दुर्गा", ta: "துர்கை", sa: "दुर्गा" },
    "#DC2626",
    { sa: "ॐ दुं दुर्गायै नमः", en: "Om Duṁ Durgāyai Namaḥ", meaning: { en: "Salutations to Goddess Durga.", te: "దుర్గా మాతకు నమస్కారం.", hi: "माँ दुर्गा को नमन।", ta: "துர்கா தேவிக்கு நமஸ்காரம்." } },
    "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥",
    { en: "Auspicious of all auspicious things, benefactor of all desires, refuge, three-eyed Gauri — salutations to you, O Narayani." },
    ["Devī Māhātmyam", "Durgā Saptaśatī", "Devī Kavacham", "Lalitā Sahasranāma", "Mahiṣāsura Mardinī Stotram"],
    ["Durgā", "Ambikā", "Kātyāyanī", "Cāmuṇḍā", "Mahiṣāsuramardinī", "Bhavānī", "Kālī", "Śāradā"],
    [{ title: "Lalitha Sahasranamam", url: A.lalita }]
  ),
  d("subrahmanya",
    { en: "Subrahmanya (Murugan)", te: "సుబ్రహ్మణ్యుడు", hi: "कार्तिकेय", ta: "முருகன்", sa: "सुब्रह्मण्यः" },
    "#EA580C",
    { sa: "ॐ शरवणभवाय नमः", en: "Om Śaravaṇabhavāya Namaḥ", meaning: { en: "Salutations to Lord Subrahmanya, born amidst the reeds.", te: "శరవణభవుడైన సుబ్రహ్మణ్యస్వామికి నమస్కారం.", hi: "शरवणभव कार्तिकेय को नमन।", ta: "சரவணபவனான முருகனுக்கு நமஸ்காரம்." } },
    "षड़ाननं कुङ्कुमरक्तवर्णं महामतिं दिव्यमयूरवाहनम्।\nरुद्रस्य सूनुं सुरसैन्यनाथं गुहं सदाहं शरणं प्रपद्ये॥",
    { en: "Six-faced, kumkum-red, of great wisdom, riding the divine peacock, son of Rudra, commander of the celestial army — I take refuge in Guha (Subrahmanya)." },
    ["Subrahmaṇya Bhujaṅgam", "Skanda Śaṣṭī Kavacham", "Kandar Anubhūti", "Tiruppugazh"],
    ["Kārtikeya", "Skanda", "Guha", "Ṣaṇmukha", "Muruga", "Śaravaṇabhava", "Kumāra", "Devasenāpati"],
    []
  ),
  d("surya",
    { en: "Surya", te: "సూర్య", hi: "सूर्य", ta: "சூரியன்", sa: "सूर्यः" },
    "#F59E0B",
    { sa: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः", en: "Om Hrāṁ Hrīṁ Hrauṁ Saḥ Sūryāya Namaḥ", meaning: { en: "Salutations to Lord Surya.", te: "సూర్యదేవుడికి నమస్కారం.", hi: "सूर्यदेव को नमन।", ta: "சூரிய பகவானுக்கு நமஸ்காரம்." } },
    "जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम्।\nतमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥",
    { en: "Radiant as hibiscus, son of Kashyapa, of great splendour, enemy of darkness, destroyer of all sins — I bow to Divakara, the maker of day." },
    ["Āditya Hṛdayam", "Sūrya Aṣṭakam", "Sūrya Sahasranāma"],
    ["Āditya", "Bhāskara", "Ravi", "Divākara", "Prabhākara", "Mārtaṇḍa", "Savitṛ", "Mitra"],
    []
  ),
  d("ayyappa",
    { en: "Ayyappa", te: "అయ్యప్ప", hi: "अय्यप्पा", ta: "ஐயப்பன்", sa: "अय्यप्पः" },
    "#111827",
    { sa: "ॐ स्वामिये शरणम् अय्यप्पा", en: "Om Svāmiye Śaraṇam Ayyappā", meaning: { en: "Lord, I take refuge in you, Ayyappa.", te: "స్వామీ! నీ శరణం అయ్యప్పా.", hi: "स्वामी! शरणम् अय्यप्पा।", ta: "ஸ்வாமியே சரணம் ஐயப்பா." } },
    "लोकवीरं महापूज्यं सर्वरक्षाकरं विभुम्।\nपार्वतीहृदयानन्दं शास्तारं प्रणमाम्यहम्॥",
    { en: "World-hero, greatly worshipped, all-protecting, all-pervading, delight of Parvati's heart — I bow to Sastha (Ayyappa)." },
    ["Harivarāsanam", "Śāstā Aṣṭakam", "Bhūtanātha Stotram"],
    ["Śāstā", "Manikaṇṭha", "Dharmaśāstā", "Hariharaputra", "Bhūtanātha", "Ayyanār"],
    []
  ),
];
