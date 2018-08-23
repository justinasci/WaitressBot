import { DialogOpenArguments } from "@slack/client";

class DialogBuilder {
    dialogArguments: DialogOpenArguments;

    build(): any {
        return this.dialogArguments;
    }

}

export { DialogBuilder };