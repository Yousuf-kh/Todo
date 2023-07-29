import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState(false);
  const [cid, setCid] = useState();
  const [esitLoading, setEsitLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getTodo = async () => {
      setIsLoading(true);
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_limit=5"
      );
      setPosts(res.data);
      setIsLoading(false);
    };
    getTodo();
  }, []);

  const addTodo = async () => {
    const obj = {
      title: input,
      id: new Date(),
    };
    if (input) {
      setIsLoading(true);

      const res = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        obj
      );

      setPosts([...posts, res.data]);
      setIsLoading(false);
      setInput("");

      toast({
        title: "Muvafaqiyatli",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Input Bosh",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const editHaldler = (c) => {
    setEdit(true);
    setInput(c.title);
    setCid(c.id);
  };

  const closeEdit = () => {
    setEdit(false);
    setInput("");
  };

  const editTitle = async () => {
    const obj = {
      title: input,
      id: new Date(),
    };
    if (edit) {
      setEsitLoading(true);
      const res = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${cid}`,
        obj
      );

      const newData = posts.map((c) => {
        if (c.id === cid) {
          return res.data;
        }
        return c;
      });
      setPosts(newData);

      toast({
        title: "Muvafaqiyatli",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setEsitLoading(false);
    }
    setInput("");
    setEdit(false);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    setPosts(posts.filter((c) => c.id !== id));
  };
  return (
    <Box>
      <Container>
        <Heading py={5} textAlign={"center"}>
          Todo List
        </Heading>

        <Flex gap={2}>
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="create new todo"
          />
          {edit ? (
            <Button isLoading={esitLoading} onClick={() => editTitle()}>
              Edit
            </Button>
          ) : (
            <Button isLoading={isLoading} onClick={() => addTodo()}>
              Add
            </Button>
          )}
          {edit && <Button onClick={() => closeEdit()}>X</Button>}
        </Flex>

        <Box pt={4}>
          {isLoading
            ? "...loading"
            : posts.map((c) => (
                <Flex
                  key={c.id}
                  my={2}
                  align={"center"}
                  justify={"space-between"}
                >
                  <Text>{c.title}</Text>
                  <HStack>
                    <Button onClick={() => editHaldler(c)} colorScheme="yellow">
                      edit
                    </Button>
                    <Button onClick={() => deleteTodo(c.id)} colorScheme="red">
                      delte
                    </Button>
                  </HStack>
                </Flex>
              ))}
        </Box>
      </Container>
    </Box>
  );
};

export default App;
