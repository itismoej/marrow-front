import { Center, Flex, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Flex paddingY="1rem" paddingX="8rem" bg="gray.900" spacing="1rem">
      <Center marginStart="3rem">
        <Link to="/">
          <Center p="4" color="gray.200" bg="green.700">
            Home
          </Center>
        </Link>
      </Center>
      <Spacer />
      <Center color="gray.300" fontSize="xl" marginEnd="3rem">
        Twitter Users Personality Detection
      </Center>
    </Flex>
  );
};

export { Header };
