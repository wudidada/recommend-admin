<template>
  <div style="padding: 10px">
    <div style="background: #fff; border-radius: 8px; padding: 20px">
      <Button type="primary" @click="addQuestion">添加问题</Button>
      <Modal
        v-model="isShowDialog"
        :title="isAddQuestion ? '添加问题' : '编辑问题'"
        @on-ok="ok"
        @on-cancel="cancel"
      >
        <Form :model="question">
          <FormItem label="问题">
            <Select
              v-model="question.type"
              :default-label="getQestionDesc"
              :loading="isLoading"
              @on-select="getAnswerList"
            >
              <Option
                v-for="quesion in questionList"
                :value="quesion.type"
                :key="quesion.type"
                >{{ quesion.desc }}</Option
              >
            </Select>
          </FormItem>

          <FormItem label="选项">
            <Select
              multiple
              @on-select="selectOption"
              v-model="selectedOptions"
            >
              <Option
                v-for="option in options"
                :value="option.value"
                :key="option.value"
                >{{ option.label }}</Option
              >
            </Select>
          </FormItem>
        </Form>
      </Modal>
      <Table :columns="columns" :data="data" style="margin-top: 12px">
        <template slot-scope="{ row }" slot="question">
          {{ typeToDesc(row.type) }}
        </template>
        <template slot-scope="{ row }" slot="options">
          <Tag v-for="option in row.options" :key="option.value">{{
            option.label
          }}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button
              type="primary"
              style="margin-right: 12px"
              @click="updateQuestion(row, index)"
              >编辑</Button
            >
            <Button type="error" @click="remove(row, index)">删除</Button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import api from "../utils/api";

export default {
  data() {
    return {
      row: 0,
      isShowDialog: false,
      isAddQuestion: false,
      isLoading: false,
      columns: [
        {
          title: "问题",
          slot: "question"
        },
        {
          title: "选项",
          slot: "options"
        },
        {
          title: "动作",
          slot: "action"
        }
      ],
      data: [],
      question: { options: [] },
      questionList: [],
      options: [],
      selectedOptions: []
    };
  },
  computed: {
    getQestionDesc() {
      if (this.question.type) {
        return this.typeToDesc(this.question.type);
      }
      return "";
    }
  },
  methods: {
    typeToDesc(type) {
      for (const q of this.questionList) {
        if (q.type == type) {
          return q.desc;
        }
      }
      return "";
    },
    selectOption(option) {
      const { label, value } = option;
      for (const [index, val] of this.question.options.entries()) {
        if (val.value == value) {
          this.question.options.splice(index, 1);
          return;
        }
      }
      this.question.options.push({ label, value });
    },
    getAnswerList(option) {
      const type = option.value;
      api.getOptions({ type }).then(response => {
        this.options.splice(0);
        this.options.push(...response.options);
        this.$set(this.question, "field", response.fieldName);
      });
    },
    getQuestionTypes() {
      this.isLoading = true;
      api
        .getQuestionTypes()
        .then(response => this.questionList.push(...response))
        .catch(err => console.log(err))
        .finally(() => (this.isLoading = false));
    },
    ok() {
      if (this.isAddQuestion) {
        api
          .addQuestion({
            ...this.question
          })
          .then(response => {
            this.data.push({
              ...this.question,
              _id: response._id
            });
            this.$Message.success("添加成功");
          })
          .catch(err => {
            console.log(err);
            this.$Message.error("添加失败");
          })
          .finally(() => this.cancel());
      } else {
        api
          .updateQuestion({
            ...this.question
          })
          .then(() => {
            this.data.splice(this.row, 1, {
              ...this.question
            });
            this.$Message.success("更新成功");
          })
          .catch(err => {
            console.log("failed");
            console.log(err);
            this.$Message.error("更新失败");
          })
          .finally(() => this.cancel());
      }
    },
    cancel() {
      this.isShowDialog = false;
      this.isAddQuestion = false;
      this.fieldName = "";
      this.options.splice(0);
      this.question = { options: [] };
      this.selectedOptions.splice(0);
    },
    addQuestion() {
      this.showDialog();
      this.isAddQuestion = true;
    },
    showDialog() {
      this.isShowDialog = true;
    },
    updateQuestion(row, index) {
      this.row = index;
      this.$set(this.question, "field", row.field);
      this.$set(this.question, "options", [...row.options]);
      this.$set(this.question, "_id", row._id);
      this.$set(this.question, "type", row.type);
      this.getAnswerList({ value: row.type });
      this.question.options.forEach(option => {
        this.selectedOptions.push(option.value);
      });
      this.showDialog();
    },
    getQuestions() {
      api.getQuestions().then(response => {
        this.data.push(...response);
      });
    },
    remove(row, index) {
      api
        .delQuestion(row._id)
        .then(() => {
          this.data.splice(index, 1);
          this.$Message.success("删除成功");
        })
        .catch(() => this.$Message.error("删除失败"));
    }
  },
  created() {
    this.getQuestions();
    this.getQuestionTypes();
  }
};
</script>

<style scoped>
</style>
