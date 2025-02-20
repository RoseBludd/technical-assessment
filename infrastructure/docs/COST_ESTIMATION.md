# Cost Estimation

## Monthly Cost Breakdown

### Compute and Database
| Resource | Specification | Cost (USD/month) |
|----------|--------------|------------------|
| RDS PostgreSQL | db.t3.medium, Multi-AZ | ~$210 |
| Storage | 20GB GP3 (2 instances) | ~$5 |
| IOPS | Included with GP3 | $0 |
| Backups | 7 days retention | Included |

### Network
| Resource | Specification | Cost (USD/month) |
|----------|--------------|------------------|
| NAT Gateway | 1 gateway | ~$32 |
| Data Transfer | 100GB/month estimate | ~$9 |
| VPC Endpoints | None required | $0 |

### Security and Monitoring
| Resource | Specification | Cost (USD/month) |
|----------|--------------|------------------|
| WAF | Basic rules | ~$5 |
| CloudWatch | Basic monitoring | Included |
| Performance Insights | Basic tier | Included |
| SNS | 1000 notifications | < $1 |

## Total Estimated Cost
**Monthly Total: ~$262 USD**

## Cost Optimization Strategies

### Immediate Savings
1. **Non-Production Environments**
   - Use single-AZ deployment: Save ~$105/month
   - Use smaller instance class (db.t3.small): Save ~$52/month

2. **Network Optimization**
   - Use VPC endpoints instead of NAT Gateway: Save ~$32/month
   - Optimize data transfer patterns: Save ~$4/month

### Long-term Savings
1. **Reserved Instances**
   - 1-year commitment: Save ~30%
   - 3-year commitment: Save ~50%

2. **Storage Management**
   - Regular cleanup of unused snapshots
   - Optimize backup retention periods

## Monitoring and Alerts
- CloudWatch billing alerts set at:
  - 80% of expected monthly spend
  - 100% of expected monthly spend
- Per-service cost allocation tags
- Monthly cost analysis and optimization review

Note: Costs are estimates based on AWS pricing in us-west-2 region as of 2024. Actual costs may vary based on usage patterns and AWS pricing changes.
