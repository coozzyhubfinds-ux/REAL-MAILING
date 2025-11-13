import axios from 'axios';

const buildClient = (apiUrl) => {
  const baseURL = `${apiUrl.replace(/\/$/, '')}/api`;
  return axios.create({ baseURL });
};

export const getLeads = async (apiUrl, params = {}) => {
  const client = buildClient(apiUrl);
  const { data } = await client.get('/leads', { params });
  return data.data;
};

export const createLead = async (apiUrl, payload) => {
  const client = buildClient(apiUrl);
  const { data } = await client.post('/leads', payload);
  return data.data;
};

export const updateLead = async (apiUrl, id, payload) => {
  const client = buildClient(apiUrl);
  const { data } = await client.put(`/leads/${id}`, payload);
  return data.data;
};

export const deleteLead = async (apiUrl, id) => {
  const client = buildClient(apiUrl);
  const { data } = await client.delete(`/leads/${id}`);
  return data.data;
};

export const importLeadsCsv = async (apiUrl, file) => {
  const client = buildClient(apiUrl);
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await client.post('/leads/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data.data;
};

export const getTemplates = async (apiUrl) => {
  const client = buildClient(apiUrl);
  const { data } = await client.get('/templates');
  return data.data;
};

export const createTemplate = async (apiUrl, payload) => {
  const client = buildClient(apiUrl);
  const { data } = await client.post('/templates', payload);
  return data.data;
};

export const updateTemplate = async (apiUrl, id, payload) => {
  const client = buildClient(apiUrl);
  const { data } = await client.put(`/templates/${id}`, payload);
  return data.data;
};

export const deleteTemplate = async (apiUrl, id) => {
  const client = buildClient(apiUrl);
  const { data } = await client.delete(`/templates/${id}`);
  return data.data;
};

export const createCampaign = async (apiUrl, payload) => {
  const client = buildClient(apiUrl);
  const { data } = await client.post('/campaigns', payload);
  return { campaign: data.data };
};

export const sendCampaign = async (apiUrl, campaignId) => {
  const client = buildClient(apiUrl);
  const { data } = await client.post(`/campaigns/${campaignId}/send`);
  return data.data;
};

export const previewCampaign = async (apiUrl, campaignId, payload) => {
  const client = buildClient(apiUrl);
  const { data } = await client.post(`/campaigns/${campaignId}/preview`, payload);
  return data.data;
};

export const getAnalytics = async (apiUrl) => {
  const client = buildClient(apiUrl);
  const { data } = await client.get('/analytics');
  return data.data;
};

export default {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  importLeadsCsv,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  createCampaign,
  sendCampaign,
  previewCampaign,
  getAnalytics
};

