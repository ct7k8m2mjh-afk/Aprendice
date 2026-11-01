import numpy as np
from scipy import ndimage
def sombra(M,p):
    # M: silhueta 0..1 (SxS). p: dx,dy (fra. de S), s1 (fra.), op1, dy2, s2, op2, y0 (inicio da rampa em fra. da altura do objeto)
    dx,dy,s1,op1,dy2,s2,op2,y0=p
    S=M.shape[0]
    ys=np.nonzero(M.max(1)>0.5)[0]; top,bot=ys.min(),ys.max(); h=max(bot-top,1)
    yy=np.arange(S)[:,None]
    w=np.clip((yy-(top+y0*h))/(0.35*h),0,1)
    Mw=M*w
    a=ndimage.gaussian_filter(ndimage.shift(Mw,(dy*S,dx*S),order=1),s1*S)
    b=ndimage.gaussian_filter(ndimage.shift(Mw,(dy2*S,0),order=1),s2*S)
    sh=1-(1-op1*a)*(1-op2*b)
    return np.clip(sh,0,1)
