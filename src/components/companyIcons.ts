import google from "@/assets/icons/companies/google.png";
import meta from "@/assets/icons/companies/meta.png";
import openai from "@/assets/icons/companies/openai.png";
import anthropic from "@/assets/icons/companies/anthropic.png";
import amazon from "@/assets/icons/companies/amazon.png";
import walmart from "@/assets/icons/companies/walmart.png";
import oracle from "@/assets/icons/companies/oracle.png";
import dell from "@/assets/icons/companies/dell.png";
import microsoft from "@/assets/icons/companies/microsoft.png";
import apple from "@/assets/icons/companies/apple.png";
import netflix from "@/assets/icons/companies/netflix.png";
import spotify from "@/assets/icons/companies/spotify.png";
import uber from "@/assets/icons/companies/uber.png";
import lyft from "@/assets/icons/companies/lyft.png";
import stripe from "@/assets/icons/companies/stripe.png";
import paypal from "@/assets/icons/companies/paypal.png";
import salesforce from "@/assets/icons/companies/salesforce.png";
import adobe from "@/assets/icons/companies/adobe.png";
import ibm from "@/assets/icons/companies/ibm.png";
import intel from "@/assets/icons/companies/intel.png";
import nvidia from "@/assets/icons/companies/nvidia.png";
import tesla from "@/assets/icons/companies/tesla.png";
import twitter from "@/assets/icons/companies/twitter.png";
import linkedin from "@/assets/icons/companies/linkedin.png";
import snap from "@/assets/icons/companies/snap.png";
import tiktok from "@/assets/icons/companies/tiktok.png";
import airbnb from "@/assets/icons/companies/airbnb.png";
import databricks from "@/assets/icons/companies/databricks.png";
import snowflake from "@/assets/icons/companies/snowflake.png";
import palantir from "@/assets/icons/companies/palantir.png";
import coinbase from "@/assets/icons/companies/coinbase.png";
import robinhood from "@/assets/icons/companies/robinhood.png";
import shopify from "@/assets/icons/companies/shopify.png";
import cisco from "@/assets/icons/companies/cisco.png";
import otherIcon from "@/assets/icons/other.png";

const COMPANY_ICONS: Record<string, string> = {
  google,
  meta,
  openai,
  anthropic,
  amazon,
  walmart,
  oracle,
  dell,
  "dell technologies": dell,
  microsoft,
  apple,
  netflix,
  spotify,
  uber,
  lyft,
  stripe,
  paypal,
  salesforce,
  adobe,
  ibm,
  intel,
  nvidia,
  tesla,
  twitter,
  x: twitter,
  linkedin,
  snap,
  tiktok,
  bytedance: tiktok,
  airbnb,
  databricks,
  snowflake,
  palantir,
  coinbase,
  robinhood,
  shopify,
  cisco,
};

export function getCompanyIcon(company: string): string {
  const key = company.toLowerCase().trim();
  return COMPANY_ICONS[key] ?? otherIcon;
}
