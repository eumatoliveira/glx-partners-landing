import { m } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: "Termos de Uso",
      updated: "Atualizado em 22 de fevereiro de 2026",
      intro:
        "Estes termos regulam o uso do site e dos servicos da GLX Partners. Ao utilizar a plataforma, voce concorda com estas condicoes.",
      sections: [
        {
          heading: "1. Aceitacao",
          body:
            "Ao acessar ou utilizar nossos servicos, voce confirma que leu e concorda com estes termos.",
        },
        {
          heading: "2. Uso permitido",
          body:
            "O uso deve ser licito e alinhado ao objetivo da plataforma. E proibido tentar violar seguranca, disponibilidade ou integridade dos servicos.",
        },
        {
          heading: "3. Conta e acesso",
          body:
            "Voce e responsavel por manter a confidencialidade de credenciais de acesso e por todas as atividades realizadas com sua conta.",
        },
        {
          heading: "4. Propriedade intelectual",
          body:
            "Conteudos, marcas, software e materiais da plataforma pertencem a GLX Partners ou licenciadores, protegidos por lei.",
        },
        {
          heading: "5. Limitacao de responsabilidade",
          body:
            "A plataforma e fornecida conforme disponibilidade. Nao garantimos ausencia total de interrupcoes, embora adotemos medidas para alta confiabilidade.",
        },
        {
          heading: "6. Alteracoes",
          body:
            "Podemos atualizar estes termos periodicamente. A versao mais recente estara sempre publicada nesta pagina.",
        },
      ],
    },
    en: {
      title: "Terms of Use",
      updated: "Updated on February 22, 2026",
      intro:
        "These terms govern the use of GLX Partners website and services. By using the platform, you agree to these conditions.",
      sections: [
        {
          heading: "1. Acceptance",
          body: "By accessing or using our services, you confirm that you have read and agreed to these terms.",
        },
        {
          heading: "2. Permitted use",
          body:
            "Use must be lawful and aligned with the platform purpose. Attempts to violate security, availability, or integrity are prohibited.",
        },
        {
          heading: "3. Account and access",
          body:
            "You are responsible for keeping access credentials confidential and for all activities carried out under your account.",
        },
        {
          heading: "4. Intellectual property",
          body:
            "Content, trademarks, software, and platform materials belong to GLX Partners or licensors and are protected by law.",
        },
        {
          heading: "5. Limitation of liability",
          body:
            "The platform is provided on an availability basis. We do not guarantee zero interruptions, although we adopt measures for high reliability.",
        },
        {
          heading: "6. Changes",
          body:
            "We may update these terms periodically. The latest version will always be published on this page.",
        },
      ],
    },
    es: {
      title: "Terminos de Uso",
      updated: "Actualizado el 22 de febrero de 2026",
      intro:
        "Estos terminos regulan el uso del sitio y los servicios de GLX Partners. Al utilizar la plataforma, usted acepta estas condiciones.",
      sections: [
        {
          heading: "1. Aceptacion",
          body: "Al acceder o usar nuestros servicios, usted confirma que leyo y acepto estos terminos.",
        },
        {
          heading: "2. Uso permitido",
          body:
            "El uso debe ser legal y alineado al objetivo de la plataforma. Se prohibe intentar vulnerar seguridad, disponibilidad o integridad.",
        },
        {
          heading: "3. Cuenta y acceso",
          body:
            "Usted es responsable por mantener confidenciales sus credenciales y por todas las actividades realizadas con su cuenta.",
        },
        {
          heading: "4. Propiedad intelectual",
          body:
            "Contenidos, marcas, software y materiales de la plataforma pertenecen a GLX Partners o licenciantes, protegidos por ley.",
        },
        {
          heading: "5. Limitacion de responsabilidad",
          body:
            "La plataforma se provee segun disponibilidad. No garantizamos ausencia total de interrupciones, aunque aplicamos medidas de alta confiabilidad.",
        },
        {
          heading: "6. Cambios",
          body:
            "Podemos actualizar estos terminos periodicamente. La version mas reciente estara publicada en esta pagina.",
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
