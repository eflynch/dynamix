# Parametric Mix Specification Editor #

## Data file syntax for version 1
```
# comment
filename u1:s1 u2:s2 u3:s3 ...
```

## Data file syntax for version 2 ... requires inverting large covariance matrix##
```
# comment
filename::u1,u2,u3,u4,...::cov00, cov01, cov02, ...; cov10, cov11, ...; ...
```

This corresponds to the density function exp(-1/2(x-u)cov^-1(x-u))