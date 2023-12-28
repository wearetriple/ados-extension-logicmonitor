import tl = require("azure-pipelines-task-lib");
import { LogicMonitor } from "./logicmonitor";

async function run() {
  try {

    const credentialType: string = tl.getInputRequired("credentialType");
    const accountName: string = tl.getInputRequired("accountName");
    const sdtType: string = tl.getInputRequired("sdtType");
    const sensorID: string = tl.getInputRequired("sensorID");
    const action: string = tl.getInputRequired("action");

    let lm = new LogicMonitor(accountName);

    if (credentialType === "bearer") {
      const bearerToken: string = tl.getInputRequired("bearerToken");
      lm.useBearerToken(bearerToken);
    } else if (credentialType === "LMVv1") {
      const accessId: string = tl.getInputRequired("accessId");
      const accessKey: string = tl.getInputRequired("accessKey");
      lm.useLMVv1Token(accessId, accessKey);
    }

    if (action === "Pause") {

      let sdtId: string = "";
      let duration: string | undefined = tl.getInput("duration");
      let durationInMinutes: number;
      if (duration === undefined) {
        durationInMinutes = 5;
      } else {
        durationInMinutes = parseInt(duration);
      }

      const sdt = lm.sdtRequest(durationInMinutes, sdtType, parseInt(sensorID));
      let lease = await lm.postSDT(sdt);
  
      if (lease.id !== undefined) {
        sdtId = lease.id;
      }

      tl.setVariable("sdtId", sdtId, false);
    } else if (action === "Unpause") {
      const sdtId: string = tl.getInputRequired("sdtId");
      lm.deleteSDT(sdtId)
    }
    
  } catch (err) {
    let errorMessage = "Failed to do something exceptional";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    tl.setResult(tl.TaskResult.Failed, errorMessage);
  }
}

run();
