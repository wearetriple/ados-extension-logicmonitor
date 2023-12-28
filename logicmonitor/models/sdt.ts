type AllSDTTypes =
  | WebsiteSDT
  | WebsiteGroupSDT
  | WebsiteCheckpointSDT
  | ResourceSDT
  | ResourceGroupSDT
  | DeviceLogPipeLineResourceSDT
  | DeviceEventSourceSDT
  | DeviceDataSourceSDT
  | DeviceDataSourceInstanceSDT
  | DeviceDataSourceInstanceGroupSDT
  | DeviceClusterAlertDefSDT
  | DeviceBatchJobSDT
  | CollectorSDT;

interface BaseSDT {
  id?: string;
  admin?: string;
  comment?: string;
  monthDay?: number;
  hour?: number;
  minute?: number;
  endHour?: number;
  endMinute?: number;
  duration?: number;
  startDateTimeOnLocal?: string;
  startDateTime: number;
  endDateTimeOnLocal?: string;
  endDateTime: number;
  isEffective?: boolean;
  timezone: string;
  type: string;
  weekOfMonth?: string;
  sdtType?: string;
  weekDay?: string;
}

interface WebsiteSDT extends BaseSDT {
  websiteId?: number;
  websiteName?: string;
}

interface WebsiteGroupSDT extends BaseSDT {
  checkpointId?: number;
  checkpointName?: string;
  websiteName?: string;
}

interface WebsiteCheckpointSDT extends BaseSDT {
  websiteGroupID?: number;
  websiteGroupName?: string;
}

interface ResourceSDT extends BaseSDT {
  deviceId?: number;
  deviceDisplayName?: string;
}

interface ResourceGroupSDT extends BaseSDT {
  dataSourceId?: number;
  dataSourceName?: string;
  deviceGroupId?: number;
  deviceGroupFullPath?: string;
}

interface DeviceLogPipeLineResourceSDT extends BaseSDT {
  deviceId?: number;
  deviceDisplayName?: string;
  deviceLogPipeLineResourceId?: number;
  logPipeLineName?: string;
}

interface DeviceEventSourceSDT extends BaseSDT {
  deviceId?: number;
  deviceDisplayName?: string;
  deviceEventSourceId?: number;
  eventSourceName?: string;
}

interface DeviceDataSourceSDT extends BaseSDT {
  deviceId?: number;
  deviceDisplayName?: string;
  deviceDataSourceId?: number;
  dataSourceName?: string;
}

interface DeviceDataSourceInstanceSDT extends BaseSDT {
  deviceId?: number;
  deviceDisplayName?: string;
  dataSourceInstanceId?: number;
  dataSourceInstanceName?: string;
}

interface DeviceDataSourceInstanceGroupSDT extends BaseSDT {
  deviceId?: number;
  deviceDisplayName?: string;
  deviceDataSourceId?: number;
  dataSourceName?: string;
  deviceDataSourceInstanceGroupId?: number;
  deviceDataSourceInstanceGroupName?: string;
}

interface DeviceClusterAlertDefSDT extends BaseSDT {
  deviceGroupId?: number;
  deviceGroupFullPath?: string;
  deviceClusterAlertDefId?: number;
  dataSourceName?: string;
}

interface DeviceBatchJobSDT extends BaseSDT {
  deviceId?: number;
  deviceDisplayName?: string;
  deviceBatchJobId?: number;
  batchJobName?: string;
}

interface CollectorSDT extends BaseSDT {
  collectorId?: number;
  collectorDescription?: string;
}
