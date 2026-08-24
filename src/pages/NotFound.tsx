import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.notFound.pageTitle;
  }, [t]);

  return (
    <div className="min-h-[80svh] flex items-center py-24">
      <div className="container">
        <p className="eyebrow mb-8">{t.notFound.eyebrow}</p>
        <h1 className="display-hero text-outline">{t.notFound.title}</h1>
        <p className="lede mt-8 max-w-md">
          {t.notFound.description}
        </p>
        <Link to="/" className="btn btn-primary btn-lg mt-10 self-start">
          <span>← {t.notFound.backButton}</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
