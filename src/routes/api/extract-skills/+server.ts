import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { jobDescription } = await request.json();
    
    if (!jobDescription || typeof jobDescription !== 'string') {
      return json({ error: 'Job description is required' }, { status: 400 });
    }
    
    // List of common DevOps and cloud technologies to look for
    const techKeywords = [
      // Cloud Platforms
      'AWS', 'Amazon Web Services', 'Azure', 'Microsoft Azure', 'GCP', 'Google Cloud Platform',
      'IBM Cloud', 'Oracle Cloud', 'DigitalOcean', 'Linode', 'Heroku',
      
      // Container Technologies
      'Docker', 'Kubernetes', 'K8s', 'Containerd', 'CRI-O', 'Podman', 'LXC', 'LXD',
      
      // CI/CD Tools
      'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Travis CI', 'TeamCity',
      'Bamboo', 'ArgoCD', 'Tekton', 'Spinnaker', 'Drone CI', 'Concourse CI',
      
      // Infrastructure as Code
      'Terraform', 'CloudFormation', 'Ansible', 'Puppet', 'Chef', 'SaltStack',
      'Pulumi', 'CDK', 'AWS CDK', 'Crossplane',
      
      // Monitoring and Observability
      'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Dynatrace', 'AppDynamics',
      'Nagios', 'Zabbix', 'Splunk', 'ELK', 'Elasticsearch', 'Logstash', 'Kibana',
      'Jaeger', 'Zipkin', 'OpenTelemetry', 'Fluentd', 'Loki',
      
      // Version Control
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial',
      
      // Scripting and Programming Languages
      'Python', 'Go', 'Golang', 'Bash', 'PowerShell', 'JavaScript', 'TypeScript',
      'Ruby', 'Java', 'C#', '.NET', 'Node.js',
      
      // Security Tools
      'Vault', 'HashiCorp Vault', 'SOPS', 'Secrets Manager', 'KMS', 'Key Management Service',
      'SonarQube', 'Snyk', 'Aqua Security', 'Twistlock', 'Prisma Cloud', 'Qualys',
      'OWASP', 'Nessus', 'OpenSCAP', 'Trivy', 'Clair',
      
      // Networking
      'NGINX', 'HAProxy', 'Istio', 'Envoy', 'Traefik', 'Kong', 'Linkerd',
      'Calico', 'Cilium', 'Flannel', 'Weave Net', 'VPC', 'Virtual Private Cloud',
      'Subnet', 'Route53', 'CloudFront', 'CDN', 'Content Delivery Network',
      
      // Database Technologies
      'MySQL', 'PostgreSQL', 'MongoDB', 'DynamoDB', 'Cassandra', 'Redis',
      'Elasticsearch', 'SQL Server', 'Oracle', 'RDS', 'Aurora', 'Cosmos DB',
      
      // Serverless
      'Lambda', 'AWS Lambda', 'Azure Functions', 'Cloud Functions', 'Fargate',
      'Knative', 'OpenFaaS', 'Serverless Framework', 'SAM', 'Serverless Application Model',
      
      // Configuration Management
      'Ansible', 'Puppet', 'Chef', 'SaltStack', 'CFEngine',
      
      // Service Mesh
      'Istio', 'Linkerd', 'Consul', 'Kuma', 'Maesh', 'Service Mesh Interface',
      
      // Other DevOps Tools
      'Jira', 'Confluence', 'Trello', 'Asana', 'Slack', 'Microsoft Teams',
      'PagerDuty', 'OpsGenie', 'VictorOps', 'StatusPage',
      
      // Methodologies
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'SRE', 'Site Reliability Engineering',
      'GitOps', 'DevSecOps', 'Continuous Integration', 'Continuous Deployment',
      'Continuous Delivery', 'Infrastructure as Code', 'IaC'
    ];
    
    // Extract skills from job description
    const extractedSkills = new Set<string>();
    
    // First, look for exact matches
    for (const tech of techKeywords) {
      const regex = new RegExp(`\\b${tech}\\b`, 'gi');
      if (regex.test(jobDescription)) {
        extractedSkills.add(tech);
      }
    }
    
    // If we found fewer than 3 skills, try to extract more using a more flexible approach
    if (extractedSkills.size < 3) {
      const words = jobDescription.split(/\s+/);
      for (const word of words) {
        const cleanWord = word.replace(/[^\w]/g, '');
        for (const tech of techKeywords) {
          if (cleanWord.toLowerCase() === tech.toLowerCase()) {
            extractedSkills.add(tech);
          }
        }
      }
    }
    
    return json({
      skills: Array.from(extractedSkills)
    });
  } catch (error) {
    console.error('Error extracting skills:', error);
    return json({ error: 'Failed to process job description' }, { status: 500 });
  }
};
