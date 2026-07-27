// Major Hindu festivals with story, celebration, pooja vidhi, and mantras.
// month is 1-12; day is approximate Gregorian for simplicity.

export const FESTIVALS = [
  {
    id: "makara-sankranti",
    name: { en: "Makara Sankranti / Pongal", te: "మకర సంక్రాంతి", hi: "मकर संक्रान्ति", ta: "பொங்கல்" },
    month: 1, day: 14,
    deity: "Surya (Sun God)",
    story:
      "Marks the Sun's northward journey (Uttarāyaṇa). Lord Vishnu killed the demon Sankarasura on this day. In Tamil Nadu, farmers offer thanks to the Sun, Earth and cattle after the harvest.",
    celebration:
      "Prepare freshly-harvested rice with jaggery and milk (Pongal / Sakkarai Pongal). Fly kites, decorate with kolam/muggu. Bathe in holy rivers. Wear new clothes and gift sweets.",
    pooja_vidhi:
      "1. Rise before sunrise, take a til (sesame) oil bath.\n2. Draw a large kolam with rice flour.\n3. Cook Pongal in a new earthen pot facing east — let it boil over saying 'Pongalo Pongal!'.\n4. Offer to Surya with turmeric, kumkum, banana, sugarcane, coconut.\n5. Recite Āditya Hṛdayam and 12 names of Sūrya.",
    mantras: [
      "ॐ सूर्याय नमः",
      "ॐ ह्रां मित्राय नमः",
      "ॐ ह्रीं रवये नमः",
      "ॐ ह्रूं सूर्याय नमः",
    ],
  },
  {
    id: "maha-shivaratri",
    name: { en: "Mahā Śivarātri", te: "మహా శివరాత్రి", hi: "महा शिवरात्रि", ta: "மகா சிவராத்திரி" },
    month: 2, day: 26,
    deity: "Shiva",
    story:
      "The great night of Shiva — commemorates the divine dance (Tāṇḍava) and Shiva's marriage to Parvati. Also the night when Shiva drank the Halāhala poison to save creation, turning his throat blue.",
    celebration:
      "Devotees observe fasting (upavāsa) and stay awake all night (jāgaraṇa), chanting 'Om Namah Shivaya' and offering bilva leaves, milk, honey and water to the Shivaliṅga.",
    pooja_vidhi:
      "1. Fast during the day.\n2. Perform Śiva Abhiṣeka in four yāmas of the night with milk, curd, ghee, honey.\n3. Chant Śrī Rudram, Śiva Tāṇḍava Stotram and Mahā Mṛtyuñjaya Mantra.\n4. Offer bilva patra (three leaves) with each mantra.\n5. Break fast next morning after sunrise.",
    mantras: [
      "ॐ नमः शिवाय",
      "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्॥",
    ],
  },
  {
    id: "holi",
    name: { en: "Holi", te: "హోళి", hi: "होली", ta: "ஹோலி" },
    month: 3, day: 14,
    deity: "Krishna / Vishnu",
    story:
      "Celebrates the burning of the demoness Holikā and the triumph of devotee Prahlāda's faith in Lord Viṣṇu. Also commemorates the divine leelas of Krishna with Radha and Gopis at Vrindavan.",
    celebration:
      "Holikā Dahan on the previous evening. Next day play with natural colors (gulal), sing bhajans, share sweets like gujiya, thandai.",
    pooja_vidhi:
      "1. Light Holikā bonfire after sunset on Pūrṇimā night.\n2. Circumambulate seven times offering coconut, jaggery, whole grains.\n3. Chant Narasimha Kavacham and prayers to Prahlāda.\n4. Next morning apply colors after a small pūjā to Krishna.",
    mantras: [
      "ॐ नमो नारायणाय",
      "ॐ नमो भगवते वासुदेवाय",
    ],
  },
  {
    id: "rama-navami",
    name: { en: "Rāma Navamī", te: "శ్రీ రామ నవమి", hi: "राम नवमी", ta: "ஸ்ரீ ராம நவமி" },
    month: 4, day: 6,
    deity: "Rama",
    story:
      "Birth of Lord Rama, the seventh avatar of Vishnu, to King Dasharatha and Queen Kausalya in Ayodhya on the ninth day (navamī) of Chaitra Śukla Pakṣa.",
    celebration:
      "Recite Rāmāyaṇa, especially Bāla Kāṇḍa. Perform Sītā-Rāma Kalyāṇam. Fast until noon (Rāma's birth muhūrta) and share prasādam.",
    pooja_vidhi:
      "1. Bathe before sunrise, wear clean clothes.\n2. Set up an altar with Rāma-Sītā-Lakṣmaṇa-Hanumān.\n3. Offer tulasi, panakam (jaggery water), vada-pappu, buttermilk.\n4. Recite Rāma Rakṣā Stotram and Viṣṇu Sahasranāma.\n5. Sing bhajans until noon.",
    mantras: [
      "ॐ श्री रामाय नमः",
      "श्री रामचन्द्राय नमः",
    ],
  },
  {
    id: "guru-purnima",
    name: { en: "Guru Pūrṇimā", te: "గురు పూర్ణిమ", hi: "गुरु पूर्णिमा", ta: "குரு பூர்ணிமா" },
    month: 7, day: 21,
    deity: "Vyāsa / Guru",
    story:
      "Honors Sage Veda Vyāsa, compiler of the Vedas, and by extension all spiritual teachers. On this day devotees pay homage to their Guru who removes ignorance.",
    celebration:
      "Visit and offer pādapūjā to your Guru. Read Vyāsa's works — Mahābhārata, Bhāgavatam. Practise silence and self-study.",
    pooja_vidhi:
      "1. Take an early morning bath.\n2. Offer flowers, fruits, dakṣiṇā at Guru's feet.\n3. Chant Guru Stotram — 'गुरुर्ब्रह्मा गुरुर्विष्णुः...'\n4. Read a chapter of the Bhagavad Gītā.",
    mantras: [
      "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परब्रह्म तस्मै श्री गुरवे नमः॥",
    ],
  },
  {
    id: "krishna-janmashtami",
    name: { en: "Kṛṣṇa Janmāṣṭamī", te: "శ్రీ కృష్ణ జన్మాష్టమి", hi: "कृष्ण जन्माष्टमी", ta: "கிருஷ்ண ஜென்மாஷ்டமி" },
    month: 8, day: 26,
    deity: "Krishna",
    story:
      "Birth of Lord Krishna, the eighth avatar of Vishnu, at midnight to Devaki and Vasudeva in a Mathura prison. Krishna was carried to Gokul, where he grew up performing divine leelas.",
    celebration:
      "Fast till midnight. Decorate a jhūlā (swing) with baby Kṛṣṇa. Sing bhajans, recite the Bhāgavatam. Break coconut, prepare 108 varieties of prasādam (chappan bhog).",
    pooja_vidhi:
      "1. Fast during the day.\n2. At midnight, bathe the Kṛṣṇa idol with pañcāmṛta (milk, curd, ghee, honey, sugar).\n3. Dress in new clothes, offer butter, misri, tulasi.\n4. Recite Madhurāṣṭakam, Gopāla Sahasranāma.\n5. Break fast after Nirājana.",
    mantras: [
      "ॐ नमो भगवते वासुदेवाय",
      "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
    ],
  },
  {
    id: "ganesh-chaturthi",
    name: { en: "Gaṇeśa Caturthī", te: "వినాయక చవితి", hi: "गणेश चतुर्थी", ta: "விநாயகர் சதுர்த்தி" },
    month: 9, day: 7,
    deity: "Ganesha",
    story:
      "Birth of Lord Ganesha, created by Goddess Parvati from turmeric paste. When Shiva returned and Ganesha stopped him from entering, Shiva severed his head — later replaced with an elephant's head, granting him primacy over all deities.",
    celebration:
      "Install a clay Gaṇeśa idol at home for 1½, 3, 5, 7, 9 or 11 days. Offer 21 modakas, durvā grass, red hibiscus. On the final day, immerse the idol (visarjana).",
    pooja_vidhi:
      "1. Install Ganesha with prāṇa-pratiṣṭhā.\n2. Perform ṣoḍaśopacāra pūjā.\n3. Offer 21 durvās while chanting 21 names.\n4. Recite Gaṇapati Atharvaśīrṣa and Saṅkaṭanāśana Gaṇeśa Stotram.\n5. Offer modakas as naivedya.",
    mantras: [
      "ॐ गं गणपतये नमः",
      "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ...",
    ],
  },
  {
    id: "navaratri",
    name: { en: "Śāradīya Navarātri", te: "శరన్నవరాత్రి", hi: "शारदीय नवरात्रि", ta: "நவராத்திரி" },
    month: 10, day: 3,
    deity: "Durga / Devi",
    story:
      "Nine nights honoring the Divine Mother in Her nine forms (Nava Durgā). Celebrates Devī's victory over Mahiṣāsura. Includes Golu (Kolu) display of dolls in South India, Garba/Dandiya in Gujarat, Durga Puja in Bengal.",
    celebration:
      "Fast, chant Devī Mahātmyam / Durgā Saptaśatī daily. Arrange Kolu of dolls. On Vijayadaśamī (10th day) celebrate the triumph of good over evil.",
    pooja_vidhi:
      "1. Kalaśa Sthāpanā on day 1.\n2. Read one adhyāya of Durgā Saptaśatī each day.\n3. Days 1-3: Durga; Days 4-6: Lakshmi; Days 7-9: Saraswati.\n4. Perform Ayudha Pūjā on day 9 (worship tools/books).\n5. Vijayadaśamī: start new learning (Vidyārambham).",
    mantras: [
      "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे",
      "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके...",
    ],
  },
  {
    id: "diwali",
    name: { en: "Dīpāvalī / Diwali", te: "దీపావళి", hi: "दीपावली", ta: "தீபாவளி" },
    month: 10, day: 21,
    deity: "Lakshmi / Rama",
    story:
      "Marks Lord Rama's return to Ayodhya after 14 years of exile and victory over Rāvaṇa. Also celebrates Lakshmi's emergence from the ocean (Samudra Manthana) and Kṛṣṇa's slaying of Narakāsura.",
    celebration:
      "Light rows of diyas, decorate with rangoli, burst firecrackers, exchange sweets. Perform Lakṣmī-Kubera Pūjā on Amāvāsyā night.",
    pooja_vidhi:
      "1. Clean and decorate the house.\n2. On Amāvāsyā evening, install Lakshmi and Ganesha idols on a red cloth.\n3. Offer lotus flowers, kamal-gaṭṭā, batāśā, and sweets.\n4. Recite Śrī Sūktam, Kanakadhārā Stotram.\n5. Light 11, 21 or 108 diyas around the house.",
    mantras: [
      "ॐ श्रीं महालक्ष्म्यै नमः",
      "ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः",
    ],
  },
  {
    id: "karthika-purnima",
    name: { en: "Kārtika Pūrṇimā", te: "కార్తీక పూర్ణిమ", hi: "कार्तिक पूर्णिमा", ta: "கார்த்திகை பூர்ணிமா" },
    month: 11, day: 15,
    deity: "Shiva / Vishnu",
    story:
      "The full moon of Kārtika, sacred to both Shiva (as Tripurāri who destroyed the three demon cities) and Vishnu. Lighting oil lamps this month is considered highly meritorious.",
    celebration:
      "Light Kārtika Dīpams throughout the month. Bathe in holy rivers (Ganga snān). Fast and read Kārtika Purāṇa.",
    pooja_vidhi:
      "1. Take a pre-dawn bath in a holy river.\n2. Light 365 wicks in ghee.\n3. Offer bilva to Shiva and tulasi to Vishnu.\n4. Recite Śiva Sahasranāma or Viṣṇu Sahasranāma.\n5. Distribute food and lamps to the needy.",
    mantras: [
      "ॐ नमः शिवाय",
      "ॐ नमो नारायणाय",
    ],
  },
  {
    id: "vaikuntha-ekadashi",
    name: { en: "Vaikuṇṭha Ekādaśī", te: "వైకుంఠ ఏకాదశి", hi: "वैकुण्ठ एकादशी", ta: "வைகுண்ட ஏகாதசி" },
    month: 12, day: 22,
    deity: "Vishnu",
    story:
      "The Ekādaśī of Dhanurmāsa Śukla Pakṣa when the gates of Vaikuṇṭha are opened. Souls that pass through the Vaikuṇṭha Dvāra of the temple are said to attain moksha.",
    celebration:
      "Complete fast (nirjala or ekabhukta). Visit Vishnu temples early morning and walk through the Uttara Dvāra (northern gate).",
    pooja_vidhi:
      "1. Fast completely from Daśamī evening.\n2. Stay awake at night chanting Viṣṇu Sahasranāma.\n3. Pass through the Vaikuṇṭha Dvāra at Brāhma Muhūrta.\n4. Break fast on Dvādaśī with tulasi tīrtha.",
    mantras: [
      "ॐ नमो नारायणाय",
      "ॐ नमो भगवते वासुदेवाय",
    ],
  },
];
