import { ArrowRightIcon, AtSignIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Input,
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { PersonalityContext } from "../Modules/personality";

const Body = () => {
  let history = useHistory();
  const { setPersonality } = useContext(PersonalityContext);
  const [isRetreiving, setIsRetreiving] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);
  const toast = useToast();
  const handleKeypress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      retrievePersonalityData();
    }
  };

  const retrievePersonalityData = () => {
    setIsRetreiving(true);
    fetch(`http://192.168.43.72:8000/users/mbti/?format=json&id=${username}`)
      .then((r) => {
        return r.json();
      })
      .then((r) => {
        if (r.mbti !== undefined) {
          setPersonality(r);
          history.push(`/users/${username}`);
        } else if (r.error !== undefined) {
          toast({
            position: "bottom-left",
            title: "Error",
            description: r.error,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .finally(() => {
        setIsRetreiving(false);
      });
  };

  return (
    <Center paddingY="15rem" bg="gray.800" color="gray.300">
      <InputGroup size="lg" w="20rem" bg="gray.800">
        <InputLeftAddon
          pointerEvents="none"
          bg="gray.800"
          borderColor="gray.700"
          children={<AtSignIcon color="gray.200" />}
        />
        <Input
          isDisabled={isRetreiving}
          isRequired
          fontSize="medium"
          value={username}
          placeholder="Twitter ID / Username"
          variant="flushed"
          padding="1rem"
          borderColor="gray.700"
          _hover={{ bg: "gray.900" }}
          _focus={{ bg: "gray.900", borderColor: "blue.400" }}
          onChange={handleChange}
          onKeyPress={handleKeypress}
        />
      </InputGroup>
      <Button
        isLoading={isRetreiving}
        colorScheme="teal"
        variant="outline"
        size="lg"
        fontSize="medium"
        marginStart="0.2rem"
        borderRadius="0"
        _hover={{ bg: "gray.700" }}
        _focus={{ bg: "gray.900" }}
        _active={{ bg: "gray.900" }}
        onClick={retrievePersonalityData}
      >
        <ArrowRightIcon w={3} />
      </Button>
    </Center>
  );
};

export { Body };
