import { Table, TableColumn, Progress, WarningPanel } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';

type Row = {
  stage: string;
  name: string;
  version: string;
  status?: string;
};

export const S3VersionsTable = () => {
  const { entity } = useEntity();
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);

  const serviceName = entity.metadata.name;

  const { value:rows , loading, error } = useAsync(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('versions3'); // backend pluginId

    const res = await fetchApi.fetch(`${baseUrl}/services/${serviceName}`);
    if (!res.ok) throw new Error(`Failed to fetch stages: ${res.status} ${res.statusText}`);

    const json = await res.json() as {
      service: string;
      stages: Record<string, { ['service-name']?: string; stage?: string; version?: string; status?: string }>;
    };

    const stages = json.stages ?? {};
    const data: Row[] = Object.entries(stages).map(([stageKey, info]) => ({
      stage: info.stage ?? stageKey,
      name: info['service-name'] ?? serviceName,
      version: info.version ?? 'unknown',
      status: info.status,
    }));

    return data;
  }, [discoveryApi, fetchApi, serviceName]);

  const columns: TableColumn<Row>[] = [
    { title: 'Stage', field: 'stage' },
    { title: 'Service', field: 'name' },
    { title: 'Version', field: 'version' },
    { title: 'Status', field: 'status' },
  ];

  if (loading) return <Progress />;
  if (error) {
    return (
      <WarningPanel title="Failed to load S3 stages">
        {error.message}
      </WarningPanel>
    );
  }

  return (
    <Table
      title="Service Stages (from S3)"
      options={{ paging: false, search: false, padding: 'dense' }}
      columns={columns}
      data={rows ?? []}
    />
  );
};