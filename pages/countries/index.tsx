import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import { z } from "zod";

export const CountriesPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ countries }) => {
  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.iso2Code}>
            <Link href={`/countries/${country.iso2Code}`}>
              <a>{country.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Countries = z
  .object({
    name: z.string(),
    iso2Code: z.string(),
  })
  .array();

type CountriesType = z.infer<typeof Countries>;

export const getStaticProps: GetStaticProps<{
  countries: CountriesType;
}> = async () => {
  const res = await fetch("https://countries.austinshelby.com/countries");
  const json = await res.json();

  const countries = Countries.parse(json);

  return { props: { countries: countries } };
};

export default CountriesPage;
