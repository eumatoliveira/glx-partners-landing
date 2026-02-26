import { m } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: "Politica de Privacidade",
      updated: "Atualizado em 22 de fevereiro de 2026",
      intro:
        "Esta politica descreve como a GLX Partners coleta, usa e protege dados pessoais ao utilizar nosso site e nossas plataformas.",
      sections: [
        {
          heading: "1. Dados coletados",
          body:
            "Podemos coletar dados de contato, dados de navegacao, informacoes de conta e dados operacionais enviados por voce para uso nos servicos.",
        },
        {
          heading: "2. Finalidade de uso",
          body:
            "Utilizamos os dados para autenticacao, suporte, operacao dos dashboards, melhorias do produto e comunicacoes relacionadas ao servico.",
        },
        {
          heading: "3. Compartilhamento",
          body:
            "Nao vendemos dados pessoais. O compartilhamento ocorre apenas com provedores necessarios para operacao tecnica, sob obrigacoes de seguranca e confidencialidade.",
        },
        {
          heading: "4. Seguranca",
          body:
            "Adotamos controles tecnicos e organizacionais para reduzir risco de acesso nao autorizado, alteracao, divulgacao ou perda de dados.",
        },
        {
          heading: "5. Direitos do titular",
          body:
            "Voce pode solicitar acesso, correcao, atualizacao ou exclusao de dados pessoais, conforme a legislacao aplicavel.",
        },
        {
          heading: "6. Contato",
          body: "Para solicitacoes de privacidade, entre em contato: contato@glxpartners.io.",
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      updated: "Updated on February 22, 2026",
      intro:
        "This policy describes how GLX Partners collects, uses, and protects personal data when you use our website and platforms.",
      sections: [
        {
          heading: "1. Data we collect",
          body:
            "We may collect contact data, browsing data, account information, and operational data you submit to use our services.",
        },
        {
          heading: "2. Purpose of processing",
          body:
            "We use data for authentication, support, dashboard operation, product improvements, and service-related communications.",
        },
        {
          heading: "3. Sharing",
          body:
            "We do not sell personal data. Sharing only occurs with providers required for technical operation, under security and confidentiality obligations.",
        },
        {
          heading: "4. Security",
          body:
            "We adopt technical and organizational controls to reduce risk of unauthorized access, alteration, disclosure, or data loss.",
        },
        {
          heading: "5. Data subject rights",
          body:
            "You may request access, correction, update, or deletion of personal data according to applicable law.",
        },
        {
          heading: "6. Contact",
          body: "For privacy requests, contact: contato@glxpartners.io.",
        },
      ],
    },
    es: {
      title: "Politica de Privacidad",
      updated: "Actualizado el 22 de febrero de 2026",
      intro:
        "Esta politica describe como GLX Partners recopila, usa y protege datos personales al utilizar nuestro sitio y plataformas.",
      sections: [
        {
          heading: "1. Datos recopilados",
          body:
            "Podemos recopilar datos de contacto, datos de navegacion, informacion de cuenta y datos operativos enviados por usted para usar los servicios.",
        },
        {
          heading: "2. Finalidad",
          body:
            "Usamos los datos para autenticacion, soporte, operacion de dashboards, mejoras del producto y comunicaciones relacionadas con el servicio.",
        },
        {
          heading: "3. Comparticion",
          body:
            "No vendemos datos personales. Solo compartimos con proveedores necesarios para la operacion tecnica, bajo obligaciones de seguridad y confidencialidad.",
        },
        {
          heading: "4. Seguridad",
          body:
            "Adoptamos controles tecnicos y organizativos para reducir riesgos de acceso no autorizado, alteracion, divulgacion o perdida de datos.",
        },
        {
          heading: "5. Derechos del titular",
          body:
            "Puede solicitar acceso, correccion, actualizacion o eliminacion de datos personales segun la legislacion aplicable.",
        },
        {
          heading: "6. Contacto",
          body: "Para solicitudes de privacidad: contato@glxpartners.io.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="pt-28 pb-16">
        <section className="container max-w-4xl">
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t.title}</h1>
            <p className="mt-3 text-sm text-zinc-400">{t.updated}</p>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">{t.intro}</p>
          </m.div>

          <div className="space-y-4">
            {t.sections.map((section, index) => (
              <m.article
                key={section.heading}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
                <p className="mt-3 text-zinc-300 leading-relaxed">{section.body}</p>
              </m.article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
