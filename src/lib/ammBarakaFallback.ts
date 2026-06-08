export const fallbackResponses = {
  greetings: [
    "وعليكم السلام ورحمة الله وبركاته يا ولدي العزيز! بارك الله فيك ونور قلبك. كيف يمكنني مساعدتك اليوم في رحلتك الإيمانية؟",
    "أهلاً بك يا بنتي الغالية، وعليكم السلام ورحمة الله وبركاته. صلّ على الحبيب ﷺ، وقل لي ما الذي يشغل بالك اليوم؟"
  ],
  yaqeen: [
    "منصة يقين يا ولدي هي مساحتك الآمنة للاستماع إلى تلاوات القرآن الكريم العذبة، وتدبر السيرة النبوية العطرة ﷺ، والتعرف على قصص الصحابة الكرام الذين رضي الله عنهم. هدفنا هو زيادة اليقين في القلوب وتسهيل الوصول للعلم النافع والروحانيات الجميلة.",
  ],
  quran: [
    "يا بني، القرآن الكريم هو ربيع القلوب ونور الصدور. أفضل الأوقات لقراءته هي في جوف الليل، وفجرًا حيث تشهده الملائكة. احرص على أن يكون لك ورد يومي، ولو صفحة واحدة، فخير الأعمال أدومها وإن قل.",
  ],
  prophet: [
    "ﷺ! ما أعظم الحديث عن الحبيب المصطفى. رحلة الهجرة النبوية يا ولدي كانت درساً في التوكل والتخطيط؛ حين قال لصاحبه الصديق: 'ما ظنك باثنين الله ثالثهما'. أكثر من الصلاة عليه لتنال شفاعته وتنشرح صدرك.",
  ],
  advice: [
    "يا بني، إذا ضاقت بك الدنيا، فنادِ 'يا الله'. الزم الاستغفار، وتذكر أن ما أصابك لم يكن ليخطئك، وما أخطأك لم يكن ليصيبك. واعلم أن مع العسر يسراً، فاصبر صبرًا جميلاً وثق بفرج الله.",
    "يا بنتي، حصني نفسك بالأذكار الصباحية والمسائية، وحافظي على صلاتك، فهي حبل الوصال بينك وبين ربك، ولا تقلقي من رزق غدٍ، فالرزاق حي لا يموت."
  ],
  sahaba: [
    "الصحابة الكرام رضي الله عنهم هم نجوم الهداية. أبو بكر الصديق صاحب الغار ورفيق الدرب، وعمر الفاروق الذي فرق الله به بين الحق والباطل، وعثمان ذو النورين الحيي الكريم، وعلي باب مدينة العلم والشجاع المغوار. في قصصهم عبر ودستور حياة يا بني.",
  ],
  default: [
    "يا ولدي العزيز، كلامك طيب ويدخل القلب. لكن اعذر كبر سني وضعف اتصالي بالإنترنت الآن (هناك مشكلة في مفتاح Gemini API). ولكن تذكر دائماً: 'من تقرب إلى الله شبراً تقرب الله إليه ذراعاً'. استعن بالله دائماً ولا تعجز.",
    "يا بنتي الغالية، سؤالك جميل وحكيم. ليتني أستطيع الإجابة عليه بالتفصيل الآن، لكن شبكة الاتصال متعبة قليلاً اليوم. دعينا نكثر من الاستغفار والصلاة على النبي ﷺ حتى يتحسن الاتصال، واعلمي أن الله دائماً يسمع دعاءك."
  ]
};

export function getAmmBarakaFallback(message: string): string {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes("سلام") || msg.includes("مرحب") || msg.includes("مسا") || msg.includes("صباح") || msg.includes("hello") || msg.includes("hi")) {
    return fallbackResponses.greetings[Math.floor(Math.random() * fallbackResponses.greetings.length)];
  }
  if (msg.includes("يقين") || msg.includes("منصة") || msg.includes("ياقين") || msg.includes("yaqeen")) {
    return fallbackResponses.yaqeen[0];
  }
  if (msg.includes("قرآن") || msg.includes("مصحف") || msg.includes("قراءة") || msg.includes("قراءه") || msg.includes("تلاو")) {
    return fallbackResponses.quran[0];
  }
  if (msg.includes("رسول") || msg.includes("النبي") || msg.includes("محمد") || msg.includes("هجرة") || msg.includes("هجره") || msg.includes("سيرة") || msg.includes("سيره")) {
    return fallbackResponses.prophet[0];
  }
  if (msg.includes("صحابة") || msg.includes("صحابي") || msg.includes("أبو بكر") || msg.includes("ابو بكر") || msg.includes("عمر") || msg.includes("عثمان") || msg.includes("علي")) {
    return fallbackResponses.sahaba[0];
  }
  if (msg.includes("نصيحة") || msg.includes("نصيحه") || msg.includes("ضيق") || msg.includes("حزن") || msg.includes("قلق") || msg.includes("تعب") || msg.includes("هم")) {
    return fallbackResponses.advice[Math.floor(Math.random() * fallbackResponses.advice.length)];
  }
  
  return fallbackResponses.default[Math.floor(Math.random() * fallbackResponses.default.length)];
}
