import service from "./request";

export default {
  getQuestions() {
    return service.get("/questions");
  },

  addQuestion(data) {
    return service.post("/add_question", data);
  },

  updateQuestion(data) {
    return service.post("/update_question", data);
  },

  delQuestion(_id) {
    return service.post("/del_question", { _id });
  },

  getQuestionTypes() {
    return service.get("/questiontypes");
  },

  addQuestionType(data) {
    return service.post("/add_question_type", data);
  },

  updateQuestionType(data) {
    return service.post("/update_question_type", data);
  },

  delQuestionType(_id) {
    return service.post("/del_question_type", { _id });
  },

  getOptions(params) {
    return service.get("/options", { params });
  }
};
