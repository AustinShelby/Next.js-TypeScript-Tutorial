import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { z } from "zod";
import { Countries } from ".";

export const CountryPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ country }) => {
  return (
    <div>
      <dl>
        {Object.entries(country).map(([key, value]) => (
          <>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </>
        ))}
      </dl>
    </div>
  );
};
const Country = z.object({
  iso2Code: z.string(),
  name: z.string(),
  region: z.string(),
  incomeLevel: z.string(),
  capitalCity: z.string(),
  longitude: z.number(),
  latitude: z.number(),
});

type CountryType = z.infer<typeof Country>;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("https://countries.austinshelby.com/countries");
  const json = await res.json();

  const countries = Countries.parse(json);

  return {
    paths: countries.map((country) => ({ params: { iso: country.iso2Code } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  {
    country: CountryType;
  },
  { iso: string }
> = async (context) => {
  const iso2Code = z.string().parse(context.params?.iso);

  const res = await fetch(
    `https://countries.austinshelby.com/countries/${iso2Code}`
  );
  const json = await res.json();

  const country = Country.parse(json);

  return { props: { country } };
};

export default CountryPage;
