import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconThreads from "@/assets/icons/IconThreads.svg";
import { SITE } from "@/config";

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/cloughrm/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Github",
    href: "https://github.com/cloughrm",
    linkTitle: ` ${SITE.title} on Github`,
    icon: IconGitHub,
  },
  {
    name: "Threads",
    href: "https://www.threads.net/@cloughrm",
    linkTitle: `${SITE.title} on Threads`,
    icon: IconThreads,
  },
] as const;

export const SHARE_LINKS = [
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Threads",
    href: "https://threads.net/intent/post?text=",
    linkTitle: `Share this post on Threads`,
    icon: IconThreads,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/feed/?shareActive=true&text=",
    linkTitle: `Share this post on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
