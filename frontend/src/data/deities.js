// All deity portraits are AI-generated in cinematic photorealistic style, self-hosted at
// /app/backend/static/deities/*.png (served via FastAPI at /api/static/deities/{id}.png)
import { EXTENDED_DEITIES, EXTENDED_BACKGROUND_CHANTS } from "./deities_extended";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "";
const D = (id) => `${BACKEND}/api/static/deities/${id}.png`;

const IMG = {
  ganesha: D("ganesha"),
  shiva: D("shiva"),
  vishnu: D("vishnu"),
  krishna: D("krishna"),
  rama: D("rama"),
  hanuman: D("hanuman"),
  lakshmi: D("lakshmi"),
  saraswati: D("saraswati"),
  durga: D("durga"),
  subrahmanya: D("subrahmanya"),
  surya: D("surya"),
  ayyappa: D("ayyappa"),
};

// Generic royalty-free devotional audio (Archive.org public domain — verified 200 OK)
const A = {
  om: "https://archive.org/download/OMChanting_201411/OM%20Chanting.mp3",
  om_shivaya: "https://archive.org/download/mantra-om-for-meditation-with-bell-sound/AUM%20Om%20Namah%20Shivaya%20Mantra%20Chants%20432%20Hz.mp3",
  ganesha: "https://archive.org/download/Ganapati_Atharvashirsha/ShriGaneshAtharvashirsha1.mp3",
  gayatri: "https://archive.org/download/tibetan-buddhist-monks-chanting-of-gayatri-mantra-108-times-meditacion/Tibetan%20Buddhist%20Monks%20Chanting%20Of%20Gayatri%20Mantra%20(108%20Times)%20meditaci%C3%B3n.mp3",
  mahamrityunjaya: "https://archive.org/download/mahamrityunjaya-mantra-108-chantings_202107/Mahamrityunjaya%20Mantra%20108%20Chantings.mp3",
  hanuman: "https://archive.org/download/HanumanChalisa_20160720/hanuman%20chalisa.mp3",
  vishnu: "https://archive.org/download/VishnuSahasranamam1/achyutamkeshavamm.mp3",
  lalita: "https://archive.org/download/lalitha-sahasranam-pri/Lalitha%20Sahasranam%20pri.mp3",
};

export const BACKGROUND_CHANTS = [
  { id: "om", label: "Om Chanting", url: A.om },
  { id: "om_shivaya", label: "Om Namaḥ Śivāya (432 Hz)", url: A.om_shivaya },
  { id: "gayatri", label: "Gāyatrī Mantra (108×)", url: A.gayatri },
  { id: "mahamrityunjaya", label: "Mahā Mṛtyuñjaya Mantra (108×)", url: A.mahamrityunjaya },
  { id: "hanuman", label: "Hanumān Chālīsā", url: A.hanuman },
  { id: "vishnu", label: "Viṣṇu Sahasranāmam", url: A.vishnu },
  { id: "lalita", label: "Lalitā Sahasranāmam", url: A.lalita },
  ...EXTENDED_BACKGROUND_CHANTS,
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
  ...EXTENDED_DEITIES,
];
