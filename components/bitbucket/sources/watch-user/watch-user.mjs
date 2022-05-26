import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Event from any Repository",
  key: "bitbucket-new-event-from-any-repository",
  description: "Emit new event when an event occurs from any repository belonging to the user. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-hooks-post)",
  version: "0.0.1",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repository",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    eventTypes: {
      propDefinition: [
        bitbucket,
        "eventTypes",
        () => ({
          subjectType: "repository",
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return `repositories/${this.workspaceId}/${this.repositoryId}/hooks`;
    },
    getWebhookEventTypes() {
      return this.eventTypes;
    },
    proccessEvent(event) {
      const {
        headers,
        body,
      } = event;

      this.$emit(body, {
        id: headers["x-request-uuid"],
        summary: `New repository event ${headers["x-event-key"]}`,
        ts: Date.parse(headers["x-event-time"]),
      });
    },
  },
};
