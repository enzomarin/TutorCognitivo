import { Stack, Text } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "./Auth";
import { DarkModeToggle } from "./DarkModeToggle";
import { ScrollArea } from "./ScrollArea";
import { SidebarLink } from "./SidebarLink";

export function Navigation() {
  const { user } = useAuth();

  const admin = (user?.role ?? "") == "ADMIN" ? true : false;

  return (
    <ScrollArea pt="5" pb="6">
      <Stack pb="6">
        <SidebarLink icon={<FaHome />} href="/">
          Inicio
        </SidebarLink>
        {user && admin && (
          <>
            <Text fontWeight="black">Selección por Código</Text>
            <SidebarLink icon={<FaSearch />} href={"selectByCode"}>
              Search by Code
            </SidebarLink>
          </>
        )}
      </Stack>

      <Stack pb={6}>
        {user && (
          <>
            <Text fontWeight="black">Tópicos</Text>
            <SidebarLink href="wpExercises">Ejercicios en contexto</SidebarLink>
          </>
        )}
      </Stack>

      <Stack pb="6">
        {user && !user.tags.includes("wp-test-user") && (
          <>
            <Text fontWeight="black">Tópicos</Text>
            <SidebarLink href={"contentSelect?topic=16,4,3,5,6,7,8&registerTopic=4"}>
              Factorización
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=16,31,17,18&registerTopic=31"}>
              Fracción Algebraica
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=24,25,26&registerTopic=24"}>
              Ecuaciones
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=19,20,21,22,23&registerTopic=19"}>
              Potencias y raíces
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=27,28,29,30&registerTopic=27"}>
              Geometría
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=34,35&registerTopic=34"}>
              Ejercicios en contexto
            </SidebarLink>
          </>
        )}
      </Stack>

      <Stack alignItems="center">
        <DarkModeToggle />
      </Stack>
    </ScrollArea>
  );
}
