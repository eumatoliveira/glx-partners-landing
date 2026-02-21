import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhySection() {
  const { t } = useLanguage();

  const items = [
    { title: t.why.whyItem1Title, desc: t.why.whyItem1Desc },
    { title: t.why.whyItem2Title, desc: t.why.whyItem2Desc },
    { title: t.why.whyItem3Title, desc: t.why.whyItem3Desc }
  ];

  return (
    <section id="why" className="py-32 bg-[#0A0A0B] relative border-t border-white/5 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-4xl md:text-6xl font-extrabold mb-8 leading-[1.1] tracking-tight text-white"
          >
            {t.why.whyTitle1}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">{t.why.whyTitle2}</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto"
          >
            {t.why.whySubtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 * index, type: "spring", stiffness: 100, damping: 20 }}
              className="bg-[#111113] p-12 border border-white/10 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-start"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 pointer-events-none" />
              <div className="w-12 h-1 bg-orange-500 mb-8 group-hover:w-full transition-all duration-700 ease-out" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight relative z-10">{item.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed relative z-10 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
