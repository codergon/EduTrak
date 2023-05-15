import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import _ from "lodash";
import dayjs from "dayjs";
import Task from "./AssignedTask";
import { db } from "../../../fb";
import Constants from "expo-constants";
import { padding } from "../../../utils";
import { useEffect, useState } from "react";
import { Quiz } from "../../../types/common";
import Icons from "../../../components/Icons";
import * as Icon from "phosphor-react-native";
import Layout from "../../../constants/Layout";
import { View } from "../../../components/Themed";
import { mockCreated } from "../../../constants/Mock";
import { MdText } from "../../../components/StyledText";
import Topbar from "../../../components/layouts/Topbar";
import { useNavigation } from "@react-navigation/native";
import { actionsConfig } from "../../../constants/Colors";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import Searchbar from "../../../components/common/Searchbar";
import EmptyState from "../../../components/common/EmptyState";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Loader from "../../../components/common/Loader";
import { setIsPending } from "../../../store/user/userSlice";

export default function AssignedTasks() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#eee" : "#444";
  const subColor = isDark ? "#444" : "#e3e3e3";
  const activeFilterColor = isDark ? "#fff" : "#000";
  const inactiveFilterColor = isDark ? "#888" : "#999";

  const [search, setSearch] = useState("");
  const [isDesc, setIsDesc] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filtered, setFiltered] = useState<Quiz[]>([]);

  const [courseIds, setCourseIds] = useState<string[]>([]);

  const statusBarHeight = Constants.statusBarHeight;
  const { userData } = useAppSelector(state => state.user);

  useEffect(() => {
    if (!userData?.uid) return;
    if (courseIds.length === 0) {
      setQuizzes([]);
      setIsLoading(false);
      return;
    }

    const quizzesRef = collection(db, "quizzes");
    const qry = query(quizzesRef, where("courseId", "in", courseIds));

    const unsub = onSnapshot(qry, snapshot => {
      const quizList: any[] = [];
      snapshot.docs.forEach(doc => {
        quizList.push({ ...doc.data(), id: doc.id });
      });

      setQuizzes(quizList);
      setIsLoading(false);
      dispatch(
        setIsPending(
          quizList.filter(item => dayjs(item?.dateDue.toDate()).diff() > 0)
            .length > 0
        )
      );
    });

    return () => unsub();
  }, [courseIds]);

  useEffect(() => {
    if (!userData?.uid || quizzes.length > 0) return;

    const q = query(
      collection(db, `registered_courses`),
      where("studentId", "==", userData?.uid)
    );

    const unsub = onSnapshot(q, snapshot => {
      let crsIds: string[] = [];
      snapshot.docs.forEach(doc => {
        crsIds.push(doc.data().courseId);
      });
      setCourseIds(crsIds);
    });

    return () => unsub();
  }, [userData?.uid]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      var keys = ["description", "courseName"];

      const ftrd = _.filter(
        quizzes,
        (quiz: Quiz) =>
          _.values(_.pick(quiz, keys)).filter(txt => {
            return typeof txt === "string"
              ? txt.toLowerCase()?.includes(search.toLowerCase().trim())
              : false;
          }).length > 0
      ).sort((a, b) =>
        isDesc
          ? a.dateDue.toMillis() - b.dateDue.toMillis()
          : b.dateDue.toMillis() - a.dateDue.toMillis()
      );

      setFiltered(ftrd);
    }, 1200);
    return () => clearTimeout(delayDebounceFn);
  }, [search, quizzes]);

  useEffect(() => {
    setFiltered(prev =>
      prev.sort((a, b) =>
        isDesc
          ? a.dateDue.toMillis() > b.dateDue.toMillis()
            ? -1
            : 0
          : b.dateDue.toMillis() > a.dateDue.toMillis()
          ? -1
          : 0
      )
    );
  }, [isDesc, filtered]);

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight + 18 }]}>
      <Topbar title="Today" subtitle={dayjs().format("dddd, DD MMMM")} />

      <View style={styles.toolbar}>
        <Searchbar search={search} setSearch={setSearch} />

        <Pressable
          style={styles.defaultBtn}
          onPress={() => {
            setIsDesc(p => !p);
          }}
        >
          {isDesc ? (
            <Icon.SortAscending size={24} weight="fill" color={iconColor} />
          ) : (
            <Icon.SortDescending size={24} weight="fill" color={iconColor} />
          )}
        </Pressable>
      </View>

      <View style={styles.actions}>
        {["active", "all"].map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => setFilter(item)}
              style={[
                styles.studyAction,
                {
                  borderColor: subColor,
                  marginLeft: index % 2 === 0 ? 0 : 5,
                  marginRight: index % 2 === 0 ? 5 : 0,
                  borderWidth: item === filter ? 1.2 : 1.2,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon__cover,
                  { backgroundColor: actionsConfig[index]?.bg },
                ]}
              >
                <Icons.SoftStar
                  style={styles.actionIcon}
                  color={actionsConfig[index]?.col}
                />
              </View>
              <MdText
                style={{
                  ...styles.actionText,
                  // textTransform: "uppercase",
                  color:
                    item === filter ? activeFilterColor : inactiveFilterColor,
                }}
              >
                {index === 1 ? "All" : "Active"}
              </MdText>
            </Pressable>
          );
        })}
      </View>
      {isLoading ? (
        <Loader
          pb={80}
          spinner={true}
          message="Fetcing your quizzes from the server"
          nextline="Please wait a moment"
        />
      ) : (
        <FlatList
          bounces={false}
          data={filtered.filter(item =>
            filter === "all" ? true : dayjs(item?.dateDue.toDate()).diff() > 0
          )}
          ListEmptyComponent={() => (
            <EmptyState
              message={
                quizzes.length === 0
                  ? "You have no quizzes yet"
                  : search
                  ? "No result found for your search"
                  : "You currently have no active quizzes"
              }
              vectorSize={quizzes.length === 0 ? 130 : 140}
              illustration={
                quizzes.length === 0 || !search ? "EmptySheet" : "NoResult"
              }
            >
              {quizzes.length === 0 && (
                <TouchableOpacity
                  style={{
                    borderWidth: 0,
                    borderRadius: 5,
                    ...padding(10, 20),
                    backgroundColor: "#2b6cce",
                  }}
                  onPress={() => {
                    navigation.navigate("Root", { screen: "Courses" });
                  }}
                >
                  <MdText
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      paddingBottom: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Register courses
                  </MdText>
                </TouchableOpacity>
              )}
            </EmptyState>
          )}
          pagingEnabled={true}
          decelerationRate="fast"
          renderItem={({ item, index }) => (
            <Task
              key={index}
              item={item}
              index={index}
              lastIndex={mockCreated?.length - 1}
            />
          )}
          showsVerticalScrollIndicator={false}
          snapToInterval={Layout.appWidth + 16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 30 }}
        />
      )}

      {quizzes.length > 0 && userData?.accountType !== "student" && (
        <TouchableOpacity
          style={{
            right: 20,
            width: 54,
            height: 54,
            bottom: 40,
            zIndex: 100,
            borderRadius: 100,
            position: "absolute",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#2b6cce",
            justifyContent: "center",
          }}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Console")}
        >
          <Icon.Plus size={18} weight="bold" color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 26,
    display: "flex",
    position: "relative",
    paddingHorizontal: 20,
    flexDirection: "column",
  },

  defaultBtn: {
    width: 30,
    height: "100%",
    marginLeft: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  toolbar: {
    zIndex: 99,
    display: "flex",
    flexDirection: "row",
  },

  actions: {
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
    flexWrap: "wrap",
    overflow: "hidden",
    flexDirection: "row",
  },
  actionText: {
    fontSize: 15,
    marginLeft: 10,
  },
  studyAction: {
    flex: 1,
    height: 48,
    padding: 4,
    borderWidth: 1,
    minWidth: "40%",
    marginBottom: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  actionIcon__cover: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: { width: 20, height: 20 },

  currentList: {
    height: 22,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    height: 22,
    borderWidth: 1,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
