<script lang="ts" setup>
const emailService = useService('email');
interface EditData {
  title: string;
}
const config = useRuntimeConfig();
const { id: emailId } = useRoute().params;
const { data: emailDetail } = await useFetch<any>(() => `emails/${emailId}`, {
  baseURL: config.public.API_BASE_URL,
});

const record = emailDetail.value;
const successResponse = ref({ id: null });
const errorBody = ref(false);
const title = ref(record.subject);
const body = ref(record.body);

const setField = (data: string) => {
  errorBody.value = false;
  body.value = data;
};

const checkvalidation = () => {
  if (!body.value) {
    errorBody.value = true;
    return false;
  }

  return true;
};

const submitHandler = async (formData: EditData) => {
  if (checkvalidation()) {
    const response = await emailService.update(Number(emailId), {
      subject: formData.title,
      body: body.value,
    });
    successResponse.value = response;
  }
};
</script>

<template>
  <div>
    <FormKit
      type="form"
      id="updateTemplate"
      @submit="submitHandler"
      :actions="false"
      #default="{ value }"
    >
      <div class="flex flex-wrap justify-between items-center mb-10">
        <div class="md:mb-0 mb-10">
          <h4 class="mb-4 text-stone">Predefined Templates</h4>
          <p class="text-silver">
            Communicator / Email/Messages / Predefined Templates /
            <span class="text-primary"> Edit Predefined Template</span>
          </p>
        </div>
      </div>
      <DashboardCard title="Add New Predefined Template">
        <div class="p-6">
          <div class="max-w-[50rem]">
            <div class="success alert-success" v-if="successResponse.id">
              Template Successfully Updated
            </div>
            <FormKit
              type="text"
              name="title"
              v-model="title"
              validation="required"
              placeholder="Title of the message"
              input-class="form-control"
              outer-class="mb-5"
            />
            <div mb-5>
              <ClientOnly>
                <RichTextEditor
                  v-model="body"
                  :contentValue="body"
                  @update:contentValue="
                    (newValue) => {
                      setField(newValue);
                    }
                  "
                />
              </ClientOnly>
              <span class="error" v-if="errorBody">Please Enter Body</span>
            </div>
            <div class="flex justify-end">
              <FormKit
                type="submit"
                input-class="btn btn-primary md:w-auto w-full"
              >
                Save
              </FormKit>
            </div>
          </div>
        </div>
      </DashboardCard>
    </FormKit>
  </div>
</template>