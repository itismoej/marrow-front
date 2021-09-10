import { ArrowRightIcon, AtSignIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Fade,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { API } from "../constants";
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
    console.log(movieId);
  };

  const retrievePersonalityData = () => {
    setIsRetreiving(true);
    fetch(
      `${API}/users/mbti/?format=json&id=${username}` +
        `${movieId ? `&movie_id=${movieId}` : ""}`
    )
      .then((r) => {
        return r.json();
      })
      .then((r) => {
        if (r.mbti !== undefined) {
          setPersonality(r);
          history.push({
            pathname: `/users/${username}`,
            search:
              movieId !== undefined && movieId !== ""
                ? `?movie_id=${movieId}`
                : "",
          });
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

  const [movieId, setMovieId] = useState<string>("");

  const handleMovieInput = (event: ChangeEvent<HTMLInputElement>) =>
    setMovieId(event.target.value);

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Center bg="gray.800" color="gray.300" minHeight="60vh">
      <VStack spacing="1rem">
        <HStack spacing="0">
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
            borderRadius="0"
            _hover={{ bg: "gray.700" }}
            _focus={{ bg: "gray.900" }}
            _active={{ bg: "gray.900" }}
            onClick={retrievePersonalityData}
          >
            <ArrowRightIcon w={3} />
          </Button>
        </HStack>

        <Fade in={!isOpen} style={{ display: !isOpen ? "" : "none" }}>
          <Button
            variant="link"
            fontWeight="light"
            fontSize="sm"
            height="2rem"
            _active={{ color: "gray.600" }}
            onClick={onToggle}
          >
            You don't know to watch a certain movie or not? give us the imdb ID!
          </Button>
        </Fade>

        <Fade in={isOpen} style={{ display: isOpen ? "" : "none" }}>
          <HStack spacing="0" height="2rem">
            <InputGroup size="sm" w="12rem" bg="gray.800">
              <Input
                value={movieId}
                placeholder="Movie IMDB ID"
                variant="unstyled"
                padding="0.5rem"
                borderColor="gray.700"
                _hover={{ bg: "gray.900" }}
                _focus={{ bg: "gray.900", borderColor: "blue.400" }}
                onChange={handleMovieInput}
                onKeyPress={handleKeypress}
              />
            </InputGroup>
            <Button
              colorScheme="red"
              variant="ghost"
              size="sm"
              borderRadius="0"
              _hover={{ bg: "red.700" }}
              _focus={{ bg: "red.900" }}
              _active={{ bg: "red.900" }}
              onClick={() => {
                onToggle();
                setMovieId("");
              }}
            >
              <CloseIcon w={3} />
            </Button>
          </HStack>
        </Fade>
      </VStack>
    </Center>
  );
};

export { Body };
