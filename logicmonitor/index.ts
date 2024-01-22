import tl = require("azure-pipelines-task-lib");
import { LogicMonitor } from "./logicmonitor";

async function run() {
  try {

    const credentialType: string = tl.getInputRequired("credentialType");
    const accountName: string = tl.getInputRequired("accountName");
    const action: string = tl.getInputRequired("action");
    const sensorID: string = tl.getInputRequired("sensorID");

    let lm = new LogicMonitor(accountName);

    // Grab the relevant credentials based on the given Authentication Type
    if (credentialType === "Bearer") {
      const bearerToken: string = tl.getInputRequired("bearerToken");
      lm.useBearerToken(bearerToken);
    } else if (credentialType === "LMVv1") {
      const accessId: string = tl.getInputRequired("accessId");
      const accessKey: string = tl.getInputRequired("accessKey");
      lm.useLMVv1Token(accessId, accessKey);
    }

    // If we need to pause the Sensor
    if (action === "Pause") {
      const sdtType: string = tl.getInputRequired("sdtType");
      
      let sdtId: string = "";
      let duration: string | undefined = tl.getInput("duration");
      let durationInMinutes: number;
      if (duration === undefined) {
        durationInMinutes = 5;
      } else {
        durationInMinutes = parseInt(duration);
      }

      const sdt = lm.sdtRequest(durationInMinutes, sdtType, parseInt(sensorID));
      let id = await lm.postSDT(sdt);
  
      if (id !== undefined) {
        sdtId = id;
      } else {
        throw new Error("Failed to get SDT ID");
      }
      // Appending STD ID with the Sensor ID so that if multiple Sensors are paused, we can find the corresponding STD ID
      sdtId = sdtId + "-" + sensorID

      // Appending SDT ID with this one, in case multiple exist
      const existingStdId: string | undefined = tl.getInput("sdtId");
      if (existingStdId !== undefined) {
        sdtId = sdtId + "," + existingStdId
      }
      tl.setVariable("sdtId", sdtId, false, true); 

    // If we need to resume the Sensor
    } else if (action === "Resume") {
      const sdtIds: string = tl.getInputRequired("sdtId");
      const stdList = sdtIds.split(",");

      // Loop trough all the SDT IDs and delete the one matching the sensor ID
      for (const sdtId of stdList) {
        const split = sdtId.split("-");
        if (split[1] === sensorID) {
          await lm.deleteSDT(sdtId) 
        }
      }
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
