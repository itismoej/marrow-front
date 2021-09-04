import { Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Flex paddingY="1rem" paddingX="8rem" bg="gray.900" spacing="1rem">
      <Center marginStart="3rem">
        <Link to="/">
          <Button
            variant="ghost"
            p="4"
            color="gray.200"
            bg="gray.800"
            _hover={{ bg: "gray.700" }}
            _focus={{ bg: "gray.900" }}
            _active={{ bg: "gray.800" }}
          >
            Home
          </Button>
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
