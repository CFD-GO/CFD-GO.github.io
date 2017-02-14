set -e
export DEBIAN_FRONTEND=noninteractive

mkdir -p cuda_inst
cd cuda_inst

wget http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-repo-ubuntu1604_8.0.44-1_amd64.deb
dpkg -i cuda-repo-ubuntu1604_8.0.44-1_amd64.deb
apt-get update
apt-get install -y cuda nvidia-cuda-toolkit

apt-get install -y python-dev python-numpy python-sympy

wget https://raw.githubusercontent.com/llaniewski/TCLB/RInside/tools/install.sh
bash install.sh rdep
bash install.sh rinside
