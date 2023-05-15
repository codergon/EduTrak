import { db } from "../../fb";
import styles from "./styles";
import Constants from "expo-constants";
import CourseForm from "./CourseForm";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Bookmark } from "phosphor-react-native";
import { MdText } from "../../components/StyledText";
import Topbar from "../../components/layouts/Topbar";
import { useAppSelector } from "../../hooks/storeHooks";
import { ScrollView, View } from "../../components/Themed";
import EmptyState from "../../components/common/EmptyState";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import CourseRegistration from "./CourseRegistration";
import Loader from "../../components/common/Loader";

export default function Courses() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const invColor = isDark ? "#fff" : "#000";
  const altColor = isDark ? "#bbb" : "#808080";
  const borderColor = isDark ? "#383838" : "#ddd";

  const statusBarHeight = Constants.statusBarHeight;
  const { userData } = useAppSelector(state => state.user);
  const [courses, setCourses] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async (courseIds: any[]) => {
    if (courseIds.length === 0) {
      setCourses([]);
      setIsLoading(false);
      return;
    }

    const courseList: any[] = [];
    const coursesRef = collection(db, "courses");
    const qry = query(coursesRef, where("id", "in", courseIds));
    const snapShot = await getDocs(qry);
    snapShot.forEach(doc => {
      courseList.push({ ...doc.data(), id: doc.id });
    });

    setCourses(courseList);
    setIsLoading(false);
  };

  useEffect(() => {
    const coursesRef = collection(db, "courses");

    const q =
      userData?.accountType === "student"
        ? query(
            collection(db, `registered_courses`),
            where("studentId", "==", userData?.uid)
          )
        : query(coursesRef, where("creatorId", "==", userData?.uid));

    const unsub =
      userData?.accountType === "student"
        ? onSnapshot(q, snapshot => {
            let courseIds: string[] = [];
            snapshot.docs.forEach(doc => {
              courseIds.push(doc.data().courseId);
            });
            fetchCourses(courseIds);
          })
        : onSnapshot(q, snapshot => {
            let courseList: any[] = [];
            snapshot.docs.forEach(doc => {
              courseList.push({ ...doc.data(), id: doc.id });
            });
            setCourses(courseList);
            setIsLoading(false);
          });

    return () => unsub();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
          paddingTop: statusBarHeight + 18,
        },
      ]}
    >
      <>
        <Topbar title="Courses" />

        {userData?.accountType === "student" ? (
          <CourseRegistration registered={courses} />
        ) : (
          <CourseForm />
        )}

        <>
          {courses?.length > 0 && (
            <View
              style={{ ...styles.headerBar, marginTop: 30, marginBottom: 14 }}
            >
              <MdText style={styles.headerBarTxt}>
                {userData?.accountType === "student"
                  ? "Registered Courses"
                  : "Your Courses"}
              </MdText>
              <Bookmark size={17} color={invColor} weight="regular" />
            </View>
          )}

          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              ...styles.listContainer,
              flex: courses?.length > 0 ? 0 : 1,
            }}
          >
            {isLoading && courses?.length === 0 ? (
              <>
                <Loader pb={40} spinner={true} />
              </>
            ) : courses?.length > 0 ? (
              courses?.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.courseItem,
                      {
                        borderColor,
                      },
                    ]}
                  >
                    <MdText style={styles.courseMain}>
                      {item.name} - {item.minLevel}
                    </MdText>
                    {item?.description && (
                      <MdText
                        style={[
                          styles.courseSub,
                          {
                            color: altColor,
                            marginBottom: 8,
                          },
                        ]}
                      >
                        {item.description}
                      </MdText>
                    )}

                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <MdText
                          style={[
                            styles.courseSub,
                            {
                              fontSize: 13,
                              color: invColor,
                              textTransform: "uppercase",
                            },
                          ]}
                        >
                          Departments:{" "}
                        </MdText>
                        <MdText
                          style={[
                            styles.courseSub,
                            {
                              color: altColor,
                              fontSize: 13,
                            },
                          ]}
                        >
                          {item.departments.join(", ")}
                        </MdText>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <EmptyState
                justifyContent="center"
                message={
                  userData?.accountType === "student"
                    ? "You haven't registered for any course"
                    : "You haven't created any course"
                }
                illustration="EmptyCourse"
              />
            )}
          </ScrollView>
        </>
      </>
    </View>
  );
}
