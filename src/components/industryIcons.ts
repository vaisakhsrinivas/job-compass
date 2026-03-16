import searchCloud from "@/assets/icons/search-cloud.png";
import socialMedia from "@/assets/icons/social-media.png";
import aiMl from "@/assets/icons/ai-ml.png";
import ecommerceCloud from "@/assets/icons/ecommerce-cloud.png";
import retail from "@/assets/icons/retail.png";
import enterpriseSoftware from "@/assets/icons/enterprise-software.png";
import hardwareIt from "@/assets/icons/hardware-it.png";
import consumerElectronics from "@/assets/icons/consumer-electronics.png";
import entertainment from "@/assets/icons/entertainment.png";
import mobility from "@/assets/icons/mobility.png";
import fintech from "@/assets/icons/fintech.png";
import creativeSoftware from "@/assets/icons/creative-software.png";
import automotiveEnergy from "@/assets/icons/automotive-energy.png";
import travelHospitality from "@/assets/icons/travel-hospitality.png";
import dataAnalytics from "@/assets/icons/data-analytics.png";
import networkingSecurity from "@/assets/icons/networking-security.png";
import saasItsm from "@/assets/icons/saas-itsm.png";
import other from "@/assets/icons/other.png";

export const INDUSTRY_ICONS: Record<string, string> = {
  "Search & Cloud": searchCloud,
  "Social Media": socialMedia,
  "AI / ML": aiMl,
  "E-Commerce & Cloud": ecommerceCloud,
  "Retail": retail,
  "Enterprise Software": enterpriseSoftware,
  "Hardware & IT": hardwareIt,
  "Consumer Electronics": consumerElectronics,
  "Entertainment": entertainment,
  "Mobility": mobility,
  "Fintech": fintech,
  "Creative Software": creativeSoftware,
  "Automotive & Energy": automotiveEnergy,
  "Travel & Hospitality": travelHospitality,
  "Data & Analytics": dataAnalytics,
  "Networking & Security": networkingSecurity,
  "Other": other,
};

export function getIndustryIcon(domain: string): string {
  return INDUSTRY_ICONS[domain] ?? other;
}
