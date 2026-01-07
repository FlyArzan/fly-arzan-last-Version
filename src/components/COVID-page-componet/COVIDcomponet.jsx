import { useQuery } from "@tanstack/react-query";
import { Box, Container, Typography, CircularProgress, Alert } from "@mui/material";

const COVIDcomponet = () => {

  const { data: covidData, isLoading, error } = useQuery({
    queryKey: ["cms", "covid_19_info"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cms/public/covid_19_info`);
      if (!response.ok) {
        throw new Error("Failed to fetch COVID-19 information");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Failed to load COVID-19 information. Please try again later.</Alert>
      </Container>
    );
  }

  const content = covidData?.content || {};

  return (
    <>
      <section className="PrivacyPolicysec1-sec">
        <div className="container">
          <div className="PrivacyPolicysec1-main">
            <div className="PrivacyPolicysec1-tital">
              <h2>{content.hero?.title || "COVID-19 Updates"}</h2>
              {content.hero?.subtitle && <p>{content.hero.subtitle}</p>}
            </div>
          </div>
        </div>
      </section>

      <Container sx={{ py: 4 }}>
        {content.introduction && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ color: "#e5e7eb", lineHeight: 1.8 }}>
              {content.introduction}
            </Typography>
          </Box>
        )}

        {content.guidelines && content.guidelines.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: "#fff", mb: 2, fontWeight: 600 }}>
              Travel Guidelines
            </Typography>
            {content.guidelines.map((guideline, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: "rgba(37,99,235,0.1)", borderRadius: 1 }}>
                <Typography variant="h6" sx={{ color: "#60a5fa", mb: 1, fontSize: "1.1rem" }}>
                  {guideline.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                  {guideline.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {content.travelRestrictions && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: "#fff", mb: 2, fontWeight: 600 }}>
              Travel Restrictions
            </Typography>
            <Typography variant="body1" sx={{ color: "#e5e7eb", lineHeight: 1.8 }}>
              {content.travelRestrictions}
            </Typography>
          </Box>
        )}

        {content.healthRequirements && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: "#fff", mb: 2, fontWeight: 600 }}>
              Health Requirements
            </Typography>
            <Typography variant="body1" sx={{ color: "#e5e7eb", lineHeight: 1.8 }}>
              {content.healthRequirements}
            </Typography>
          </Box>
        )}

        {content.lastUpdated && (
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #262626" }}>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
              Last Updated: {new Date(content.lastUpdated).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default COVIDcomponet;
