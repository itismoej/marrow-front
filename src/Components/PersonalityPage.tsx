import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  HStack,
  Image,
  SimpleGrid,
  Skeleton,
  Spacer,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PersonalityContext } from "../Modules/personality";

type PersonalityPageParams = {
  username: string;
};

const PersonalityPage = () => {
  let params = useParams<PersonalityPageParams>();
  const { personality, setPersonality } = useContext(PersonalityContext);
  const [isRetreiving, setIsRetreiving] = useState<boolean>(true);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true);
  const [movies, setMovies] = useState<Array<any>>([]);
  const toast = useToast();

  useEffect(() => {
    if (personality.mbti === "") {
      fetch(
        `http://192.168.43.72:8000/users/mbti/?format=json&id=${params.username}`
      )
        .then((r) =>
          r.json().then((data): any => ({ ...data, status: r.status }))
        )
        .then((r) => {
          if (r.status === 200) setPersonality(r);
          else if (r.status === 400) {
            setPersonality({ mbti: undefined });
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
    } else {
      setIsRetreiving(false);
    }

    if (personality.mbti?.length === 4 && moviesLoading) {
      fetch(
        `http://192.168.43.72:8000/movies/recommend/?mbti=${personality.mbti}`
      )
        .then((r) => r.json())
        .then((r) => {
          setMovies(r);
        })
        .finally(() => {
          setMoviesLoading(false);
        });
    }
  });

  return (
    <>
      <Center paddingY="4rem" bg="gray.800" color="gray.300">
        {isRetreiving ? (
          <Spinner color="red.500" size="xl" padding="1rem" />
        ) : (
          <VStack spacing="5rem" width="100%">
            {personality.mbti === undefined ? (
              <Text fontSize="xl">
                This user, currently is not available in twitter.
              </Text>
            ) : (
              <>
                <VStack>
                  <Text fontSize="3xl" marginBottom="1rem">
                    {params.username}'s personality type is
                  </Text>
                  <Center
                    borderRadius="2xl"
                    bg="gray.900"
                    paddingY="0.2rem"
                    paddingX="2rem"
                    sx={{ borderBottom: "solid 3px #63B3ED" }}
                  >
                    <Text
                      fontSize="5xl"
                      fontWeight="extrabold"
                      letterSpacing="widest"
                      color="gray.100"
                    >
                      {personality.mbti}
                    </Text>
                  </Center>
                </VStack>
              </>
            )}
          </VStack>
        )}
      </Center>
      {personality.mbti !== undefined && (
        <Box width="100%" paddingY="2rem" bg="gray.900" color="gray.300">
          <Center>
            <Text fontSize="lg" color="gray.400">
              {moviesLoading ? (
                <>
                  <Spinner size="xs" marginEnd="2" />
                  Finding couple movies suitable for {params.username} to watch!
                </>
              ) : (
                <>Movies found based on {params.username}'s MBTI</>
              )}
            </Text>
          </Center>
          <SimpleGrid padding="2rem" columns={2} spacing={10}>
            {movies.map((movie) => {
              return (
                <Skeleton
                  endColor="gray.700"
                  startColor="gray.800"
                  bg="gray.800"
                  height="250px"
                  speed={1.2}
                  isLoaded={!moviesLoading}
                >
                  <HStack h="100%" w="100%">
                    <Image height="inherit" src={movie?.image_link} />
                    <VStack
                      paddingStart="1rem"
                      paddingEnd="2rem"
                      width="100%"
                      align="start"
                      spacing="1"
                    >
                      <HStack spacing="2">
                        <StarIcon w="4" h="4" color="yellow.400" />
                        <Text fontSize="2xl" color="white" fontWeight="bold">
                          {movie?.imdb_rate}
                        </Text>
                        <Text>/ 10</Text>
                      </HStack>

                      <Text fontSize="xl" color="white">
                        {movie?.name}
                      </Text>
                      <Text fontSize="sm" color="gray.300">
                        {movie?.genre_list.join(", ")}
                      </Text>
                      <Divider borderColor="gray.600" padding="0.5rem" />
                      <Spacer />
                      <Text fontSize="sm" color="gray.400" textAlign="justify">
                        {movie?.description?.length > 220
                          ? movie?.description?.substring(0, 220) + "..."
                          : movie?.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Skeleton>
              );
            })}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
};

export { PersonalityPage };
