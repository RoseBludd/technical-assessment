# AWS PostgreSQL Infrastructure Architecture

## Viewing the Infrastructure Diagram

To view this diagram:
1. Visit [mermaid.live](https://mermaid.live)
2. Copy the entire code block below (from ```mermaid to ```)
3. Paste it into the left panel of mermaid.live
4. The diagram will render automatically in the right panel

## Infrastructure Flow Diagram

```mermaid
graph TB
    Internet((Internet)) --> WAF[WAF Rules]
    WAF --> IGW[Internet Gateway]
    IGW --> PublicSubnet1[Public Subnet AZ1]
    IGW --> PublicSubnet2[Public Subnet AZ2]
    
    PublicSubnet1 --> NAT[NAT Gateway]
    NAT --> PrivateSubnet1[Private Subnet AZ1]
    NAT --> PrivateSubnet2[Private Subnet AZ2]
    
    subgraph VPC[VPC 10.0.0.0/16]
        IGW
        PublicSubnet1
        PublicSubnet2
        NAT
        PrivateSubnet1
        PrivateSubnet2
        
        subgraph RDS[RDS Multi-AZ]
            DB1[Primary DB] --> DB2[Standby DB]
        end
        
        subgraph Security
            SG[Security Groups]
            NACL[Network ACLs]
        end
        
        subgraph Monitoring
            CW[CloudWatch]
            SNS[SNS Alerts]
        end
    end
    
    %% Security connections
    SG --> DB1
    SG --> DB2
    SG --> NAT
    NACL --> PublicSubnet1
    NACL --> PublicSubnet2
    NACL --> PrivateSubnet1
    NACL --> PrivateSubnet2
    
    PrivateSubnet1 --> DB1
    PrivateSubnet2 --> DB2
    
    CW --> SNS
    DB1 --> CW
    DB2 --> CW
```

## Component Details

### Networking
- **VPC**: 10.0.0.0/16
  - Public Subnets: For NAT Gateway
  - Private Subnets: For RDS instances
- **Internet Gateway**: For public internet access
- **NAT Gateway**: For private subnet internet access

### Database
- **RDS PostgreSQL**:
  - Multi-AZ deployment
  - Automated backups
  - Performance insights enabled
  - Encrypted storage

### Security
- **Security Groups**: Firewall rules at instance level
- **NACLs**: Subnet-level network ACLs
- **WAF**: Web Application Firewall rules

### Monitoring
- **CloudWatch**:
  - CPU utilization alerts
  - Storage space monitoring
  - Connection count tracking
- **SNS**: Alert notifications
