import { SimpleGrid, Box } from "@chakra-ui/react";

const Footer = () => {
  return (
    <SimpleGrid padding="5rem" h="30vh" bg="#171923" columns={3} spacing={10}>
      <Box bg="#285E61" height="120px"></Box>
      <Box bg="#285E61" height="120px"></Box>
      <Box bg="#285E61" height="120px"></Box>
    </SimpleGrid>
  );
};

export { Footer };
