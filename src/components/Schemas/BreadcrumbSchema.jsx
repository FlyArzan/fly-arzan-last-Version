import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const BreadcrumbSchema = ({ breadcrumbs }) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url ? `https://flyarzan.com${crumb.url}` : undefined
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

BreadcrumbSchema.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string
    })
  )
};

export default BreadcrumbSchema;
