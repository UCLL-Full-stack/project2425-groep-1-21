import { useRouter } from "next/router";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const locale = event.target.value;
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div className="ml-6">
      <select
        id="language"
        className="p-1.5 bg-green-900 text-white border border-gray-600 rounded"
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="nl">Nederlands</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};

export default Language;