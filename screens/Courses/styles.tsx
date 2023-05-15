import { StyleSheet } from "react-native";
import { padding } from "../../utils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    paddingTop: 26,
    display: "flex",
    position: "relative",
    paddingHorizontal: 20,
    flexDirection: "column",
  },
  errorCont: {
    marginTop: 8,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },

  createBtn: {
    flex: 0,
    marginTop: 12,
    borderRadius: 8,
    ...padding(12, 16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2560ba",
  },

  listContainer: {
    width: "100%",
  },
  courseItem: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    ...padding(14, 12),
    marginBottom: 10,
  },
  courseMain: {
    fontSize: 16,
    width: "100%",
    marginBottom: 6,
    lineHeight: 16 * 1.3,
  },
  courseSub: {
    fontSize: 14,
  },

  // FORM STYLES
  formContainer: {
    zIndex: 2,
    // overflow: "visible",
  },
  headerBar: {
    marginBottom: 20,
    ...padding(6, 4, 10),
    borderBottomWidth: 0.8,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e3e3e3",
    justifyContent: "space-between",
  },
  headerBarTxt: {
    fontSize: 17,
  },

  formRow: {
    zIndex: 2,
    width: "100%",
    flexDirection: "row",
  },
  inputContainer: {
    flex: 0,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    ...padding(4, 12),
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    ...padding(8, 0),
    fontFamily: "general-md",
  },
  selectBtn: {
    minWidth: 92,
    borderWidth: 1,
    height: "100%",
    marginLeft: 12,
    borderRadius: 8,
    ...padding(0, 14),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "red",
  },
  selectBtnTxt: {
    fontSize: 14.5,
  },
});

export default styles;
